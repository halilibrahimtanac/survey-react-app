import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore'


class Firebase {
    
    app

    constructor() {
        this.app = initializeApp(this.firebaseConfig)
    }

    async signUp(userName,email,password,userType) {
        const auth = await getAuth()
        await createUserWithEmailAndPassword(auth,email,password)
        .then((userResponse) => {
            updateProfile(auth.currentUser, { displayName: userName})
            .then(() => {
                const db = getFirestore(this.app)
                const docRef = addDoc(collection(db,'users'),{
                    uid: auth.currentUser.uid,
                    userName: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    password: password,
                    userType: userType
                }).then(() => {
                    console.log(docRef.id + " document is added")
                    console.log("user created and profile updated!!!")
                })
                
            })
        })
    }

    async signIn(email,password) {
        const auth = await getAuth()
        let isSignedIn
        await signInWithEmailAndPassword(auth,email,password)
        .then((userResponse) => {
            console.log("signed in")
            isSignedIn = true
        }).catch((err) => {
            isSignedIn = false
        })

        return isSignedIn
    }

    async getCurrentUser(){
        const auth = await getAuth()
        const db = await getFirestore()
        const userRef = await collection(db,"users")
        if(auth.currentUser){
            const q = await query(userRef,where("uid", "==", auth.currentUser.uid))
            const snapShot = await getDocs(q)
            return snapShot.docs[0].data()        
        }
        return false
    }

    async signOut(){
        const auth = await getAuth()
        signOut(auth).then(() => {
            console.log("logged out")
        }).catch((err) => {
            console.log("error!!!")
        })
    }

    async newSurvey(survey){
        const db = await getFirestore()
        await addDoc(collection(db,"surveys"),{
            title: survey.title,
            questions : survey.questions,
            duration: survey.duration,
            category: survey.category,
            leftEmpty: survey.leftEmpty,
            questionNavigate: survey.questionNavigate,
            year: survey.year,
            expireDate: survey.expireDate
        }).then((response) => {
            console.log("Survey added succesfully: ", response)
        }).catch((err) => {
            console.log("Some error occured: ", err)
        })
    }

    async getsurveys(){
        let surveys = []
        let d = new Date()
        let currentDate = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        }
        const db = await getFirestore()
        let cu = await this.getCurrentUser()
        let answeredSurveys = []
        const q = query(collection(db,"answers"), where("userInfo", "==", cu.uid))
        const answerSnapshot = await getDocs(q)
        answerSnapshot.forEach((a) => {
            let answer = a.data()
            answeredSurveys = [...answeredSurveys, answer.surveyInfo.id]
        })
        const surveySnapshot = await getDocs(collection(db,"surveys"))
        surveySnapshot.forEach((s) => {
               let survey = {
                ...s.data(),
                id: s.id
               }
               
               if ( !answeredSurveys.includes(survey.id)){
                  if(currentDate.year === parseInt(survey.expireDate.slice(0,4))){
                        if(currentDate.month === parseInt(survey.expireDate.slice(5,7))){
                                if(currentDate.day < parseInt(survey.expireDate.slice(8,10))){
                                    surveys = [...surveys, survey] 
                                }
                    }
                        else if (currentDate.month < parseInt(survey.expireDate.slice(5,7))){
                             surveys = [...surveys, survey] 
                    }
                  }
                  else if(currentDate.year < parseInt(survey.expireDate.slice(0,4))){
                        surveys = [...surveys, survey] 
                  }
                   
               }
               
            
        })
        return surveys
    }

    async submitAnswers(answeredSurvey){
        const db = await getFirestore()
        await addDoc(collection(db,"answers"), {
            userInfo: answeredSurvey.userInfo.uid,
            surveyInfo: answeredSurvey.surveyInfo,
            answers: answeredSurvey.answers
        })
        .then(response => {
            console.log("Answers added to collection: ", response)
        })
        .catch(err => console.log(err))
    }

    async getAnswers(){
        const db = await getFirestore()
        let answers = []
        const answerSnapshot = await getDocs(collection(db,"answers"))
        answerSnapshot.forEach((res) => {
            let data = res.data()
            answers = [...answers, data] 
        })
        return answers
    }

    async getUser(id){
        const db = await getFirestore()
        const q = query(collection(db, "users"), where("uid", "==", id))
        const snapshot = await getDocs(q)
        return snapshot.docs[0].data()
    }

    async getAllSurvey(){
        const db = await getFirestore()
        let surveys = []
        const surveySnapshot = await getDocs(collection(db, "surveys"))
        surveySnapshot.forEach((s) => {
            surveys = [...surveys, s.data()]
        })
        return surveys
    }

    async reuseSurvey(survey){
        let d = new Date()
        let currentDate = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        }
        survey.title = survey.title + " (Re-used)"

        if(currentDate.year === parseInt(survey.expireDate.slice(0,4))){
            if(currentDate.month === parseInt(survey.expireDate.slice(5,7))){
                    if(currentDate.day < parseInt(survey.expireDate.slice(8,10))){
                        this.newSurvey(survey)
                    }
                    else if (currentDate.day >= parseInt(survey.expireDate.slice(8,10))){
                        alert("This date has already expired")
                    }
            }
            else if (currentDate.month < parseInt(survey.expireDate.slice(5,7))){
                 this.newSurvey(survey)
            }
            else if (currentDate.month > parseInt(survey.expireDate.slice(5,7))){
                alert("This date has already expired")
            }
        }
        else if(currentDate.year < parseInt(survey.expireDate.slice(0,4))){
            this.newSurvey(survey)
        }
        else if (currentDate.year > parseInt(survey.expireDate.slice(0,4))){
            alert("This date has already expired")
        }

    }
}

export default Firebase
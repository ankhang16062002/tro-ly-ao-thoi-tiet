const API_ID = '19a749e2baa9b6110f6f9b6d2dae7ca4'   //lưu ý trong dự án thực tế thì thêm API vào phía sever

//defined methods querySelector
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

//if information is not have
const DEFAULT_VALUE = '--'

//select element
const inputSeach = $('.seach-input')
const cityName = $('.info-body-city')
const statusWeather = $('.info-body-weather')
const imgWeather = $('.info-body img')
const weatherTemp = $('.info-body-temp')
const sunRise = $('.sun-rise')
const sunDown = $('.sun-down')
const weatherWeet = $('.item-weet')
const windSpeed = $('.item-speed')

const container = $('.container')

//listen event change in input seach
inputSeach.addEventListener('change', (e)=> {
    //use fetch to select data weather of city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${API_ID}&lang=vi&units=metric`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        //set value information of weather to element
        cityName.innerHTML = data.name || DEFAULT_VALUE
        statusWeather.innerHTML = data.weather[0].description || DEFAULT_VALUE
        imgWeather.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        weatherTemp.innerHTML = Math.round(data.main.temp)
        sunRise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm')  // use moment libary to convert time
        sunDown.innerHTML = moment.unix(data.sys.sunset).format('H:mm')
        weatherWeet.innerHTML = data.main.humidity
        windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2)
    })
})


/* Speech Recogniton*/
const micro = $('.microphone')

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition   //when brower is not support, chosen webkit
const recognition = new SpeechRecognition()     //creat object to recognition speech

recognition.lang = 'vi-VI'    // use VietNameses for recognition
recognition.continuous = false  // use to recongniton one single sentences

//listen click in micro
micro.addEventListener('click', (e) => {
    micro.classList.add('recording')   //add class recoding when record

    recognition.start()    // start to recognition
})

//event when recogniton end
recognition.onend = ((e) => {
    recognition.stop()  // stop to recogniton
    micro.classList.remove('recording')  // remove class recoding when not record
})

//event recognition error
recognition.onerror = (err) => {
    console.log('Speech Recognition: ', err)
}

//event when recogniton return result
recognition.onresult = (e) =>  {
    var text = e.results[0][0].transcript  // get text user speak
    handleText(text)
}

//function to hanleText user speak
function handleText(text) {
    text = text.toLowerCase()    // convert text to lowercase to slove

    //user ask about weather
    if(text.includes('thời tiết tại')) {
        var citySeach = text.split('tại')[1].trim('')   //select name of city

        inputSeach.value = citySeach    //set value for input seach

        var eventCreated = new Event('change')   //creat one event has name is change to listen repeat
        inputSeach.dispatchEvent(eventCreated)  // listen event change on input

        return;
    }

    //user asked to change background
    if(text.includes('thay đổi màu nền')) {
        var color = text.split('màu nền')[1].trim('')    //get color change
        container.style.background = color    //set color for background
        return;
    }

    //user asked to change background default
    if(text.includes('màu nền mặc định')) {
        container.style.background = ''
        return;
    }

    //user asked hours minutes
    if(text.includes('mấy giờ')) {
        var text = `${moment().hours()} hours ${moment().minutes()} minutes`   // use momnet library
        speaker(text)   // speak text
        return;
    }

    speaker('Read against')   // if it is break
}


/* Speech synthesis */
var synth = window.speechSynthesis     // get object to speak in window

//function to slove when speak

function speaker(text) {
    if(synth.speaking) {    // if micro is speaking, out
        console.log('micro is working....')
        return;
    }

    const utter = new SpeechSynthesisUtterance(text)     // creat object include language, content text

    utter.onend = () => {
        console.log('sppeeach end')   // when sentenses end
    }

    utter.onerror = (error) => {
        console.log('error: ', error)   // is paused when error
    }

    synth.speak(utter)   // speack sentences
}




/* cách để tìm kiếm bằng giọng nói
    - chọn micro
    - hỏi về thời tiết :   'thời tiết tại' +   Tên tỉnh
    - thay đổi nền:  'thay đổi màu nền" + màu sắc     (lưu ý màu sắc nói bằng tiếng anh)
    - hỏi về giờ: 'mấy giờ' +     rồi, rồi mày ......
    
    lưu ý: khi hỏi những câu sai cú pháp thì micro sẽ bắt mình đọc lại :    read against !

    Tương lai khi nào rảnh sẽ update thêm 1 số chức năng + fix bugs

*/

//Code by AN KHANG





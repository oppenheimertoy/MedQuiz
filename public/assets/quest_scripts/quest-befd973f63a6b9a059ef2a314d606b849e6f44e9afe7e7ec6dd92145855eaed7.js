console.log("Script is working")
var inputParametres = {

    //anamnesis input parametres
    anamnesisData: [
        [
            {
                doctor: "Здравствуйте! Что вас беспокоит?",
                patient: "У меня боли за грудиной",
                eng_category: "complaints",
                ru_category: "Жалобы"
            }
        ],
        [
            {
                doctor: "Опишите ваши боли, какого они характера?",
                patient: "Давящие, сжимающие и как - будто печёт",
                eng_category: "complaints",
                ru_category: "Жалобы"
            },
            {
                doctor: "Когда возникли боли?",
                patient: "Боль возникла около 1,5 часа назад и постепенно нарастала",
                eng_category: "disease_anamnesis",
                ru_category: "Анамнез заболевания"

            },
            {
                doctor: "Боль отдаёт куда-нибудь?",
                patient: "Отдаёт под левую лопатку и в левое плечо",
                eng_category: "complaints",
                ru_category: "Жалобы"
            },
            {
                doctor: "При каких обстоятельствах возникла боль?",
                patient: "Я сидел и смотрел телевизор, всё было хорошо, вдруг возникли неприятные ощущения в груди и появился холодный липкий пот",
                eng_category: "disease_anamnesis",
                ru_category: "Анамнез заболевания"
            },
        ],
        [
            {
                doctor: "У вас раньше были подобные боли?",
                patient: "Нет, такие боли впервые",
                eng_category: "disease_anamnesis",
                ru_category: "Анамнез заболевания"
            },
            {
                doctor: "Вы принимали какие-нибудь лекарства?",
                patient: "Да, я рассосал таблетку Валерианы, но боли не уменьшились",
                eng_category: "disease_anamnesis",
                ru_category: "Анамнез заболевания"
            },
            {
                doctor: "Какие у вас заболевания по жизни?",
                patient: "У меня гипертоническая болезнь, сахарный диабет(на таблетках), остеохондроз позвоночника",
                eng_category: "life_anamnesis",
                ru_category: "Анамнез жизни",
            },
            {
                doctor: "У вас есть аллергия на какие-либо лекарства?",
                patient: "Аллергических реакций никогда не было",
                eng_category: "allergological_anamnesis",
                ru_category: "Аллергологический анамнез"
            }
        ]
    ],
    countQuestions: 0,

    //physical research input parametres
    openedPhysicalResearchModule: false,

    //instrumenral research input parametres
    openedInstrumentalResearchModule: false,
    openedPulkoksimetr: false,
    openedEkg: false,
    openedTroponinovyjTest: false,
    openedGlukometr: false,

    //diagnosis input parametres
    diagnosisMain: [],
    diagnosisComplications: [],
    diagnosisAccompanyingIllnesses: [],
    correctDiagnosisMain: 'Острый коронарный синдром с подъёмом ST',
    correctDiagnosisComplications: [],
    correctDiagnosisAccompanyingIllnesses: ["Сахарный диабет инсулиннезависимый", "Гипертоническая болезнь", "Остеохондроз позвоночника"],
    diagnosisWrong: false,

    //treatment input parametres
    isOpenedTreatment: "Нет",
    treatmentMedicate: [],
    correctTreatmentMedicate: [
        {
            name: "Анальгетики",
            drugs: ["Морфин", "Фентанил"],
            drugsType: "or",
            drugsCount: 2
        },
        {
            name: "Нитраты",
            drugs: ["Нитроглицерин", "Изосорбид динитрат"],
            drugsType: "or",
            drugsCount: 2
        },
        {
            name: "Средства, влияющие на свертывание крови",
            drugs: ["Гепарин", "Ацетилсалициловая кислота", "Клопидогрел"],
            drugsType: "and",
            drugsCount: 3
        },
        {
            name: "Тромболитики",
            drugs: ["Алтеплаза", "Тенектеплаза", "Фортелизин"],
            drugsType: "onlyOne",
            drugsCount: 3
        },
        {
            name: "Антиаритмические средства",
            drugs: ["Метопролол"],
            drugsType: "and",
            drugsCount: 1
        }
    ],
    treatmentNonMedicate: [],
    correctTreatmentNonMedicate: ["Внутривенный доступ", "Оксигенотерапия"],
    medicateTreatmentWrong: false,
    medicateTreadmentNotFull: false,
    moreThan1Thrombolytic: false
}


window.addEventListener("load", () => {

    document.querySelector(".anamnesis").addEventListener("click", () => {
        console.log("Clicked Anamnesis")
    })

    const modalStarting = document.querySelector(".modal-starting")
    modalStarting.style.display = "flex"

    document.querySelector(".modal_start").addEventListener("click", () => {
        modalStarting.style.display = "none"
        controller()
        menuModules()
    })
})


/***********/
//CHART
/***********/
function controller() {
    addPatientMesageInChart("Здравствуйте, доктор!")
    dialogController()
}
function dialogController() {

    //Удаляем из массива блок вопросов
    if (inputParametres.anamnesisData.length !== 0) {
        var questionBlock = inputParametres.anamnesisData.shift()
        addQuestion(questionBlock)
    }
    else {
        document.querySelector(".questions").querySelector(".box_body").innerHTML = "Все вопросы заданы."
        document.querySelector(".blinker").style.color = "#99cc00"
    }


    var questions = document.querySelectorAll('.question')
    questions.forEach((question, index, arr) => {
        inputParametres.countQuestions = questions.length
        question.addEventListener("click", async event => {
            var numberQuestion = question.getAttribute("number")
            question.remove()
            addDoctorMesageInChart(questionBlock[numberQuestion].doctor)
            addInAnamnesis(questionBlock[numberQuestion].patient, questionBlock[numberQuestion].eng_category, questionBlock[numberQuestion].ru_category)
            await addPatientMesageInChart(questionBlock[numberQuestion].patient)
            inputParametres.countQuestions--;
            //другие команды
            if (questions.length === 1 || inputParametres.countQuestions === 0) dialogController()
        })
    })
}
function addDoctorMesageInChart(message) {
    var chartBox = document.querySelector(".chart")
    var chartBody = chartBox.querySelector(".box_body")
    chartBody.innerHTML += '<div class="medic">' + message + ' <span>' + getTime() + '</span> </div>'
    scrollToEnd()
}
async function addPatientMesageInChart(message) {

    var chartBox = document.querySelector(".chart")
    var chartBody = chartBox.querySelector(".box_body")
    await sleep(500)
    chartBody.innerHTML += '<div class="patient loading"> <div class="load">...</div> </div>'
    scrollToEnd()
    await sleep(1000)
    document.querySelector(".loading").remove()
    chartBody.innerHTML += '<div class="patient">' + message + ' <span>' + getTime() + '</span> </div>'
    scrollToEnd()
}
function addInAnamnesis(message, en_category, ru_category) {
    document.querySelector(".default-message") ? document.querySelector(".default-message").remove() : ""
    var classCategory = document.querySelector("." + en_category)
    if (classCategory) classCategory.innerHTML += '<p>' + message + '</p>'
    else {
        document.querySelector(".modal-body-anamnesis").innerHTML +=
            '<div class="' + en_category + '">' +
            '<h2>' + ru_category + '</h2>' +
            '<p>' + message + '</p>' +
            '</div>'

    }
}
function scrollToEnd() {
    var chartBody = document.querySelector(".box_body")
    chartBody.scrollTop = chartBody.scrollHeight
}
function getTime() {
    const now = new Date
    return now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// QUESTIONS
function addQuestion(arrQuestionBlock) {
    var questionsBox = document.querySelector(".questions")
    var questionsBody = questionsBox.querySelector(".box_body")
    arrQuestionBlock.forEach((questObject, index) => {
        questionsBody.innerHTML += '<div class="question" number="' + index + '">' + questObject.doctor + '</div>'
    })
}
/***********/
//END CHART
/***********/



/***********/
//MENU
/***********/
function menuModules() {
    openCloseMobMenu()
    anamnesisModule()
    physicalResearchModule()
    instrumentalResearchModule()
    diagnosisModule()
    treatmentModule()
    finishModule()
}
function openCloseMobMenu() {
    document.querySelector('.mobile-menu').addEventListener('click', () => {
        document.querySelector('.arrow').classList.toggle("open")
        document.querySelector('.box.menu').classList.toggle("mob-open")
    })
}
//ANAMNESIS MODULE
function anamnesisModule() {
    const anamnesis = document.querySelector(".anamnesis")
    anamnesis.addEventListener("click", () => {
        document.querySelector(".modal-anamnesis").style.display = "flex"
        buttonAction("anamnesis")
    })
}

// PHISICAL RESEARCH MODULE
function physicalResearchModule() {
    const physicalResearch = document.querySelector(".physical-research")
    physicalResearch.addEventListener("click", () => {
        document.querySelector(".modal-physical-research").style.display = "flex"
        buttonAction("physical-research")
        inputParametres.openedPhysicalResearchModule = true
    })
}

// INSTRUMENTAL RESEARCH MODULE
function instrumentalResearchModule() {
    const physicalResearch = document.querySelector(".instrumental-research")
    physicalResearch.addEventListener("click", () => {
        document.querySelector(".modal-instrumental-research").style.display = "flex"
        buttonAction("instrumental-research")
        inputParametres.openedInstrumentalResearchModule = true
    })
}

// DIAGNOSIS MODULE
function diagnosisModule() {
    const diagnosis = document.querySelector(".diagnosis")
    diagnosis.addEventListener("click", () => {

        if (!inputParametres.openedPhysicalResearchModule || !inputParametres.openedInstrumentalResearchModule) {
            document.querySelector(".modal-non-active-diagnosis").style.display = "flex"
            pastNoneActiveResearch()
            buttonAction("non-active-diagnosis")
        } else {
            document.querySelector(".modal-diagnosis").style.display = "flex"
            setDiagnosisConfig()
            buttonAction("diagnosis")
        }
    })
}
function pastNoneActiveResearch() {
    document.querySelector(".modal-body-non-active-diagnosis").innerHTML =
        '<h2>Перед постановкой диагноза необходимо провести:</h2><ul>' +
        (!inputParametres.openedPhysicalResearchModule ? '<li style="margin-top: 10px;">Физикальное исследование</li>' : '') +
        (!inputParametres.openedInstrumentalResearchModule ? '<li style="margin-top: 10px;">Инструментальные исследования</li>' : '') +
        '</ul>'
}
function setDiagnosisConfig() {
    document.querySelector(".modal-diagnosis").querySelectorAll("input").forEach(input => {
        if (input.name === "main-diagnosis" && inputParametres.diagnosisMain.indexOf(input.id) !== -1) input.checked = true
        else if (input.name === "complications-diagnosis" && inputParametres.diagnosisComplications.indexOf(input.id) !== -1) input.checked = true
        else if (input.name === "accompanying-illnesses-diagnosis" && inputParametres.diagnosisAccompanyingIllnesses.indexOf(input.id) !== -1) input.checked = true
        else input.checked = false
    })
}
// END DIAGNOSIS MODULE

// TREATMENT MODULE
function treatmentModule() {
    const treatment = document.querySelector(".treatment")

    treatment.addEventListener("click", () => {

        if (!inputParametres.diagnosisMain.length &&
            !inputParametres.diagnosisComplications.length &&
            !inputParametres.diagnosisAccompanyingIllnesses.length
        ) {
            document.querySelector(".modal-non-active-treatment").style.display = "flex"
            buttonAction("non-active-treatment")
        }
        else {
            document.querySelector(".modal-treatment").style.display = "flex"
            inputParametres.isOpenedTreatment = "Да"
            categoryTreatmentBlock()
            medicateBlock()
            nonMedicateBlock()
            buttonAction("treatment")
        }
    })
}
function categoryTreatmentBlock() {
    document.querySelector(".category-treatment").innerHTML =
        '<span class="btn-medicate active">Медикаментозное</span>' +
        '<span class="btn-non-medicate">Немедикаментозное</span>'
}
function medicateBlock() {
    const medicateArr = [
        {
            name: "Кардиотонические средства",
            drugs: ["Эпинефрин", "Допамин", "Фенилэфрин", "Гексопреналин", "Дигоксин"]
        },
        {
            name: "Адсорбенты",
            drugs: ["Активированный уголь", "Активированный уголь + алюминия оксид", "Лигнин гидролизный"]
        },
        {
            name: "Нитраты",
            drugs: ["Нитроглицерин", "Изосорбид динитрат"]
        },
        {
            name: "Антиаритмические средства",
            drugs: ["Магния сульфат", "Прокаинамид", "Лидокаин", "Амиодарон", "Пропранолол", "Метопролол", "Верапамил", "Калия и магния аспарагинат"]
        },
        {
            name: "Антигистаминные средства",
            drugs: ["Кальция хлорид", "Кальция глюконат", "Дифенгидрамин", "Хлоропирамин"]
        },
        {
            name: "Антихолинергические средства",
            drugs: ["Атропина сульфат"]
        },
        {
            name: "Бронхолитики",
            drugs: ["Фенотерол + ипратропия бромид", "Сальбутамол", "Будесонид", "Аминофиллин"]
        },
        {
            name: "Антигипертензивные средства",
            drugs: ["Клонидин", "Моксонидин", "Урапидил", "Нифедипин", "Каптоприл", "Эналаприл"]
        },
        {
            name: "Гормональные средства",
            drugs: ["Преднизолон", "Инсулин лизпро двухфазный", "Инсулин глулизин", "Инсулин аспарт двухфазный", "Гидрокортизон", "Окситоцин", "Бетаметазон", "Дексаметазон"]
        },
        {
            name: "Диуретические средства",
            drugs: ["Фуросемид"]
        },
        {
            name: "Анальгетики",
            drugs: ["Фентанил", "Морфин", "Трамадол", "Кеторолак", "Метамизол натрия", "Метамизол натрия + питотифен + фенпивериния бромид", "Парацетамол"]
        },
        {
            name: "Нейролептики",
            drugs: ["Дроперидол", "Хлорпромазин"]
        },
        {
            name: "Детоксицирующие средства",
            drugs: ["Галантамин", "Димеркаптопропансульфонат натрия", "Цинка бисвинилимидазола диацетат", "Натрия тиосульфат", "Налоксон", "Парафин жидкий", "Тиамин", "Аскорбиновая кислота", "Тиоктовая кислота", "Натрия гидрокарбонат", "Этилметилгидроксипиридина сукцинат", "Калий-железо гексацианоферрат", "Кальция тринатрия пентетат", "Флумазенил", "Ацетилцистеин"]
        },
        {
            name: "Седативные средства",
            drugs: ["Диазепам", "Мидазолам"]
        },
        {
            name: "Миотропные спазмолитики",
            drugs: ["Платифиллин", "Папаверина гидрохлорид", "Дротаверин"]
        },
        {
            name: "Стимуляторы дыхания",
            drugs: ["Кофеин (кофеин-бензоат натрия)"]
        },
        {
            name: "Средства, влияющие на свертывание крови",
            drugs: ["Гепарин", "Клопидогрел", "Ацетилсалициловая кислота", "Аминометилбензойная кислота", "Этамзилат", "Транексамовая кислота", "Апротинин"]
        },
        {
            name: "Тромболитики",
            drugs: ["Алтеплаза", "Тенектеплаза", "Фортелизин", "Проурокиназа"]
        },
        {
            name: "Противорвотные средства",
            drugs: ["Метоклопрамид", "Ондансетрон"]
        },
        {
            name: "Инфузионная терапия",
            drugs: ["Декстаран", "Реополиглюкин", "Гидроксиэтилкрахмал", "Декстроза", "Меглюмина натрия сукцинат", "Раствор Рингера", "Натрия хлорид"]
        }
    ]
    document.querySelector(".content-treatment").innerHTML =
        '<div class="medicate" > ' +
        '<div class="left-bar bar"><ul>' +
        getLeftBar(medicateArr) +
        '</ul></div>' +
        '<div class="right-bar bar">' +
        getRightBar(medicateArr) +
        '</div>' +
        '</div>'
}
function getLeftBar(ArrayByObj) {
    let leftBar = ''
    ArrayByObj.forEach((objCategory, i) => {
        leftBar +=
            '<li class="group-' + i + (!i ? " active" : "") + '">' +
            objCategory.name + '</li>\n'
    })
    return leftBar
}
function getRightBar(ArrayByObj) {
    let rightBar = ''
    ArrayByObj.forEach((objCategory, i) => {
        rightBar += '<div class="group-' + i + '-drugs"' +
            ' style="display: ' + (!i ? "block" : "none") + ';">' +
            getDrugsList(objCategory, i) +
            '</div>'
    })
    return rightBar
}
function getDrugsList(group, groupIndex) {
    let DrugsList = ''
    group.drugs.forEach((drug, i) => {
        var id = 'group-' + groupIndex + '-drug-' + i
        DrugsList +=
            '<div class="drug">' +
            '<input id="' + id + '" type="checkbox" data-group-name="' + group.name + '" value="' + drug + '"' +
            (inputParametres.treatmentMedicate.find(obj => obj.drugs.indexOf(drug) !== -1) ? "checked" : "") + '>' +
            '<label for="' + id + '">' + drug + '</label>' +
            '</div>'
    })
    return DrugsList
}
function nonMedicateBlock() {
    const nonMedicateArr = [
        "Внутривенный доступ",
        "Внутрикостный доступ",
        "Оксигенотерапия",
        "Воздуховод",
        "Ларингеальная маска",
        "Интубация трахеи",
        "Коникотомия",
        "Зондовое промывание желудка",
        "Катетеризация мочевого пузыря",
        "Электрическая кардиоверсия",
        "Дефибрилляция",
        "Компрессии грудной клетки (СЛР)",
        "Искусственная вентиляция лёгких"
    ]
    document.querySelector(".content-treatment").innerHTML +=
        '<div class="non-medicate">' +
        getNonMedicateList(nonMedicateArr) +
        '</div >'
}
function getNonMedicateList(arr) {
    let list = ''
    arr.forEach((item, i) => {
        list +=
            '<div class="non-medicate-radio">' +
            '<input id="non-medicate-radio-' + i + '" value="' + item + '" type="checkbox" ' + (inputParametres.treatmentNonMedicate.indexOf(item) !== -1 ? "checked" : "") + '>' +
            '<label for="non-medicate-radio-' + i + '">' + item + '</label>' +
            '</div>'
    })
    return list
}
function setActiveLi(activeClass) {
    document.querySelectorAll(".medicate li").forEach(li => {

        if (li.className !== activeClass && li.classList.contains("active")) {
            li.classList.remove("active")
            document.querySelector('.' + li.className + '-drugs').style.display = "none"
        }
        if (li.className === activeClass && !li.classList.contains("active")) {
            document.querySelector('.' + li.className + '-drugs').style.display = "block"
            li.classList.add("active")

        }
    })
}
function setActiveSpan(activeClass) {
    document.querySelectorAll(".category-treatment span").forEach(span => {
        if (span.className !== activeClass && span.classList.contains("active")) {
            span.classList.remove("active")
            document.querySelector('.' + span.className.substr(4)).style.display = "none"
        }
        if (span.className === activeClass && !span.classList.contains("active")) {
            document.querySelector('.' + span.className.substr(4)).style.display = "flex"
            span.classList.add("active")

        }
    })
}
function saveTreatmentInBuffer() {
    inputParametres.treatmentMedicateBuffer = []/*inputParametres.treatmentMedicate*/
    inputParametres.treatmentNonMedicateBuffer = []//inputParametres.treatmentNonMedicate
    document.querySelectorAll(".medicate input").forEach(input => {
        if (input.checked) {
            let indexMedicate = inputParametres.treatmentMedicateBuffer.find(obj => obj.name === input.getAttribute("data-group-name"))
            if (indexMedicate) indexMedicate.drugs.push(input.value)
            else inputParametres.treatmentMedicateBuffer.push({
                name: input.getAttribute("data-group-name"),
                drugs: [input.value]
            })
        }
    })
    document.querySelectorAll(".non-medicate input").forEach(input => {
        input.checked && inputParametres.treatmentNonMedicateBuffer.push(input.value)
    })
}
function getMedicateTreatment() {
    document.querySelector(".modal-view-treatment").style.display = "flex"
    if (inputParametres.treatmentMedicateBuffer.length) {
        let list = "<h2>Медикаментозное лечение</h2><ul>"
        inputParametres.treatmentMedicateBuffer.forEach(objMedicateDrug => {
            list += "<li>" + objMedicateDrug.name + "</li>" +
                "<ul>" + objMedicateDrug.drugs.map(drug => '<li>' + drug + '</li>').join("\n") + "</ul>"
        })
        list += '</ul>'
        document.querySelector(".modal-view-body-treatment").innerHTML = list
    } else document.querySelector(".modal-view-body-treatment").innerHTML = ""
}
function getNonMedicateTreatment() {
    if (inputParametres.treatmentNonMedicateBuffer.length) {
        let list = "<h2>Немедикаментозное лечение</h2><ul>"
        inputParametres.treatmentNonMedicateBuffer.forEach(nonMedicateDrug => {
            list += "<li>" + nonMedicateDrug + "</li>"
        })
        list += '</ul>'
        document.querySelector(".modal-view-body-treatment").innerHTML += list
    }
}
// END TREATMENT MODULE


//------------
// FINISH MODULE
//------------
function finishModule() {
    document.querySelector(".close-game").addEventListener("click", async () => {
        if (document.querySelector(".close-game").classList.contains("active")) {
            document.querySelector(".modal-finish").style.display = "flex"

            const finishBody = document.querySelector(".modal-body-finish")
            anamnesisCheck(finishBody)
            phisicalResearchCheck(finishBody)
            instrumentalResearchCheck(finishBody)
            diagnosisCheck(finishBody)
            treatmentCheck(finishBody)

            console.log("Тут надо отправить запрос")

            let user1 = {
                name: 'John',
                surname: 'Smith'
            }

            let xhr = new XMLHttpRequest();
            xhr.timeout = 3000
            xhr.open('POST', '127.0.0.1:3000/quest/user_answer')

            xhr.send(user1)

            xhr.onload = function(){
                if (xhr.status != 200) {
                    alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
                } else {
                    alert(`Готово, получили ${xhr.response.length} байт`)
                }
            }

            xhr.onerror = function() {
                alert("Запрос не удался");
            }
            


            let result =  response.json()
            console.log(result.message)

            console.log('Ответ принят')

            document.querySelector("button.close-finish").addEventListener("click", event => {

                location.reload()
            })
        }
    })
}
// CHECKING BY ANAMMNESIS
function anamnesisCheck(parentNode) {
    parentNode.innerHTML =
        '<div class="category"><h2>1. Жалобы и анамез' +
        (!inputParametres.anamnesisData.length && !inputParametres.countQuestions ? `<span class="correctly">&#10003;</span>` : ``) +
        '</h2>' +
        (inputParametres.anamnesisData.length || inputParametres.countQuestions ? `<div class="wrong-message">Не все вопросы заданы<span class="wrong">x</span></div>` : ``) +
        '</div>'
}
// CHECKING BY PHISICAL RESEARCH
function phisicalResearchCheck(parentNode) {
    parentNode.innerHTML +=
        '<div class="category"><h2>2. Физикальное исследование' +
        (inputParametres.openedPhysicalResearchModule ? `<span class="correctly">&#10003;</span>` : ``) +
        '</h2>' +
        (!inputParametres.openedPhysicalResearchModule ? `<div class="wrong-message">Не проводилось<span class="wrong">x</span></div>` : ``) +
        '</div>'
}
// CHECKING BY INSTRUMENTAL RESEARCH
function instrumentalResearchCheck(parentNode) {
    parentNode.innerHTML +=
        '<div class="category"><h2>3. Инструментальные исследования' +
        (inputParametres.openedPulkoksimetr && inputParametres.openedEkg && inputParametres.openedTroponinovyjTest && inputParametres.openedGlukometr ? `<span class="correctly">&#10003;</span>` : ``) +
        '</h2>' +
        (inputParametres.openedPulkoksimetr ? `<div class="message">Пульсоксиметр<span class="correctly">&#10003;</span></div>` : ``) +
        (inputParametres.openedEkg ? `<div class="message">ЭКГ<span class="correctly">&#10003;</span></div>` : ``) +
        (inputParametres.openedTroponinovyjTest ? `<div class="message">Тропониновый тест<span class="correctly">&#10003;</span></div>` : ``) +
        (inputParametres.openedGlukometr ? `<div class="message">Глюкометр<span class="correctly">&#10003;</span></div>` : ``) +
        (!inputParametres.openedPulkoksimetr || !inputParametres.openedEkg || !inputParametres.openedTroponinovyjTest || !inputParametres.openedGlukometr ? `<div class="wrong-message">Не все исследования проведены<span class="wrong">x</span></div>` : ``) +
        '</div>'
}
// CHECKING BY DIAGNOSIS 
// Формирует текст с результатами прохождения квеста
// diagnosisMainCheck(), diagnosisComplicationsCheck(), diagnosisAccompanyingIllnessesCheck возвращают текст HTML
function diagnosisCheck(parentNode) {
    var diagnosisInnerText = '<div class="subcategory">Основной:' +
        diagnosisMainCheck() +
        '</div>' +
        '<div class="subcategory">Осложнения:' +
        diagnosisComplicationsCheck() +
        '</div>' +
        '<div class="subcategory">Сопутствующие заболевания:' +
        diagnosisAccompanyingIllnessesCheck() +
        '</div>'

    parentNode.innerHTML +=
        '<div class="category"><h2>4. Диагноз' +
        (!inputParametres.diagnosisWrong ? '<span class="correctly">&#10003;</span>' : '') +
        '</h2>' +
        diagnosisInnerText +
        '</div>'
}
function diagnosisMainCheck() {
    if (inputParametres.diagnosisMain[0]) {
        var ru_name = document.querySelector('#' + inputParametres.diagnosisMain[0]).value
        if (ru_name !== inputParametres.correctDiagnosisMain) inputParametres.diagnosisWrong = true
        return '<div class="message">' +
            ru_name + (ru_name === inputParametres.correctDiagnosisMain ? '<span class="correctly">&#10003;</span>' : '<span class="wrong">x</span>') +
            '</div>' +
            (ru_name !== inputParametres.correctDiagnosisMain ? '<div class="wrong-message">Диагноз выставлен не правильно<span class="wrong">x</span></div>' : '')
    } else {
        inputParametres.diagnosisWrong = true
        return ru_name = '<div class="wrong-message">Основной диагноз не выставлен<span class="wrong">x</span></div>'
    }

}
function diagnosisComplicationsCheck() {
    if (inputParametres.diagnosisComplications.length) {
        let message = ''
        let correctAnswer = false
        let wrongAnswer = false
        inputParametres.diagnosisComplications.forEach(complication => {
            var ru_name = document.querySelector('#' + complication).value

            if (inputParametres.correctDiagnosisComplications.indexOf(ru_name) !== -1) {
                correctAnswer = true
                inputParametres.correctDiagnosisComplications.splice(inputParametres.correctDiagnosisComplications.indexOf(ru_name), 1)
                message += '<div class="message">' + ru_name + '<span class="correctly">&#10003;</span></div>'
            } else {
                wrongAnswer = true
                message += '<div class="message">' + ru_name + '<span class="wrong">x</span></div>'
            }
        })
        if (wrongAnswer) message += '<div class="wrong-message">Диагноз выставлен не правильно<span class="wrong">x</span></div>'
        if (inputParametres.correctDiagnosisComplications.length && correctAnswer) {
            message += '<div class="wrong-message">Диагноз выставлен не полностью<span class="wrong">x</span></div>'
            wrongAnswer = true
        }
        if (!inputParametres.diagnosisWrong) inputParametres.diagnosisWrong = wrongAnswer
        return message
    }
    else if (!inputParametres.correctDiagnosisComplications.length) return '<div class="message">Нет осложнений<span class="correctly">&#10003;</span></div>'
    else {
        nputParametres.diagnosisWrong = true
        return '<div class="wrong-message">Диагноз выставлен не полностью<span class="wrong">x</span></div>'
    }
}
function diagnosisAccompanyingIllnessesCheck() {
    if (inputParametres.diagnosisAccompanyingIllnesses.length) {
        let message = ''
        let correctAnswer = false
        let wrongAnswer = false
        inputParametres.diagnosisAccompanyingIllnesses.forEach(accompanyingIllnesses => {
            var ru_name = document.querySelector('#' + accompanyingIllnesses).value

            if (inputParametres.correctDiagnosisAccompanyingIllnesses.indexOf(ru_name) !== -1) {
                correctAnswer = true
                inputParametres.correctDiagnosisAccompanyingIllnesses.splice(inputParametres.correctDiagnosisAccompanyingIllnesses.indexOf(ru_name), 1)
                message += '<div class="message">' + ru_name + '<span class="correctly">&#10003;</span></div>'
            } else {
                wrongAnswer = true
                message += '<div class="message">' + ru_name + '<span class="wrong">x</span></div>'
            }
        })
        if (wrongAnswer) message += '<div class="wrong-message">Диагноз выставлен не правильно<span class="wrong">x</span></div>'
        if (inputParametres.correctDiagnosisAccompanyingIllnesses.length && correctAnswer) {
            message += '<div class="wrong-message">Диагноз выставлен не полностью<span class="wrong">x</span></div>'
            wrongAnswer = true
        }
        if (!inputParametres.diagnosisWrong) inputParametres.diagnosisWrong = wrongAnswer
        return message
    }
    else if (!inputParametres.correctDiagnosisAccompanyingIllnesses.length) return '<div class="message">Нет сопутствующих заболеваний<span class="correctly">&#10003;</span></div>'
    else {
        inputParametres.diagnosisWrong = true
        return '<div class="wrong-message">Диагноз выставлен не полностью<span class="wrong">x</span></div>'
    }
}

// CHECKING BY TREATMENT
function treatmentCheck(parentNode) {

    let treatmentInnerText = medicateCheck() +
        nonMedicateCheck() +
        wrongMedicateMessage();

    parentNode.innerHTML +=
        '<div class="category"><h2>5. Лечение' +
        (!inputParametres.medicateTreatmentWrong && !inputParametres.medicateTreadmentNotFull && !inputParametres.moreThan1Thrombolytic ? '<span class="correctly">&#10003;</span>' : '') +
        '</h2>' +
        treatmentInnerText +
        '</div>'
}
function medicateCheck() {
    let message = ''
    if (inputParametres.treatmentMedicate.length) {
        inputParametres.treatmentMedicate.forEach(medicateObj => {
            message +=
                '<div class="message">' + medicateObj.name.toUpperCase() + ':' +
                medicateDrugsCheck(medicateObj) +
                '</div>'
        })
    }
    // else message = '<div class="wrong-message">Медикаментозное лечение не назначено<span class="wrong">x</span></div>'

    return message
}
function medicateDrugsCheck(obj) {
    let message = obj.drugs.map(drug => {
        let objIndex = inputParametres.correctTreatmentMedicate.findIndex(correctObj => correctObj.name === obj.name)
        if (objIndex !== -1 && inputParametres.correctTreatmentMedicate[objIndex].drugs.indexOf(drug) !== -1) {
            inputParametres.correctTreatmentMedicate[objIndex].drugs.splice(inputParametres.correctTreatmentMedicate[objIndex].drugs.indexOf(drug), 1)
            return '<div class="message">' + drug + '<span class="correctly">&#10003;</span></div>'
        } else {
            inputParametres.medicateTreatmentWrong = true
            return '<div class="message">' + drug + '<span class="wrong">x</span></div>'
        }

    }).join("\n")
    return message
}
function nonMedicateCheck() {
    let text = ''
    if (inputParametres.treatmentNonMedicate.length) {
        text = '<div class="message">НЕМЕДИКАМЕНТОЗНОЕ ЛЕЧЕНИЕ:'

        text += inputParametres.treatmentNonMedicate.map(drug => {
            if (inputParametres.correctTreatmentNonMedicate.indexOf(drug) !== -1) {
                inputParametres.correctTreatmentNonMedicate.splice(inputParametres.correctTreatmentNonMedicate.indexOf(drug), 1)
                return '<div class="message">' + drug + '<span class="correctly">&#10003;</span></div>'
            }
            else {
                inputParametres.medicateTreatmentWrong = true
                return '<div class="message">' + drug + '<span class="wrong">x</span></div>'
            }
        }).join("")

        text += '</div>'
    }
    return text
}
function wrongMedicateMessage() {
    let wrongMessage = ''
    wrongHandler()
    wrongMessage += (inputParametres.medicateTreatmentWrong ? '<div class="wrong-message">Лечение назначено не правильно<span class="wrong">x</span></div>' : '')
    wrongMessage += (inputParametres.moreThan1Thrombolytic ? '<div class="wrong-message">Одновременно назначено несколько тромболитиков<span class="wrong">x</span></div>' : '')
    wrongMessage += (inputParametres.medicateTreadmentNotFull ? '<div class="wrong-message">Лечение назначено не полностью<span class="wrong">x</span></div>' : '')
    return wrongMessage
}
function wrongHandler() {
    //drugsType "OnlyOne" Handler
    inputParametres.correctTreatmentMedicate.find(obj => obj.drugsType === 'onlyOne' &&
        (obj.drugsCount - obj.drugs.length) > 1) && (inputParametres.moreThan1Thrombolytic = true)
    inputParametres.correctTreatmentMedicate.find(obj => obj.drugsType === 'onlyOne' &&
        obj.drugsCount === obj.drugs.length) && (inputParametres.medicateTreadmentNotFull = true)
    //drugsType "or" handler
    inputParametres.correctTreatmentMedicate.find(obj => obj.drugsType === 'or' &&
        obj.drugsCount === obj.drugs.length) && (inputParametres.medicateTreadmentNotFull = true)
    //drugsType "and" heandler
    inputParametres.correctTreatmentMedicate.find(obj => obj.drugsType === 'and' &&
        obj.drugs.length) && (inputParametres.medicateTreadmentNotFull = true)
    //nonMedicate wrong handler
    inputParametres.correctTreatmentNonMedicate.length && (inputParametres.medicateTreadmentNotFull = true)
}

function isCommonCheck() {
    return ((!inputParametres.anamnesisData.length && !inputParametres.countQuestions) &&
        (!inputParametres.anamnesisData.length && !inputParametres.countQuestions) &&
        (inputParametres.openedPulkoksimetr && inputParametres.openedEkg && inputParametres.openedTroponinovyjTest && inputParametres.openedGlukometr) &&
        (!inputParametres.diagnosisWrong) &&
        (!inputParametres.medicateTreatmentWrong && !inputParametres.medicateTreadmentNotFull && !inputParametres.moreThan1Thrombolytic) ? "Правильно" : "Неправильно"
    )
}
//------------------
// END FINISH MODULE
//------------------


//ACTION BUTTONS FOR ALL MODULES
function buttonAction(parentClass) {
    document.querySelector("button.close-" + parentClass).addEventListener("click", event => {
        document.querySelector(".modal-" + parentClass).style.display = "none"
    })
    if (parentClass === "instrumental-research") {
        document.querySelector(".instrument.pulkoksimetr").addEventListener("click", event => {
            document.querySelector(".modal-pulkoksimetr").style.display = "flex"
            inputParametres.openedPulkoksimetr = true
            buttonAction("pulkoksimetr")
        })
        document.querySelector(".instrument.ekg").addEventListener("click", event => {
            document.querySelector(".modal-ekg").style.display = "flex"
            inputParametres.openedEkg = true
            buttonAction("ekg")
        })
        document.querySelector(".instrument.troponinovyj-test").addEventListener("click", event => {
            document.querySelector(".modal-troponinovyj-test").style.display = "flex"
            inputParametres.openedTroponinovyjTest = true
            buttonAction("troponinovyj-test")
        })
        document.querySelector(".instrument.glukometr").addEventListener("click", event => {
            document.querySelector(".modal-glukometr").style.display = "flex"
            inputParametres.openedGlukometr = true
            buttonAction("glukometr")
        })
    }
    if (parentClass === "diagnosis") {
        document.querySelector("button.assign-diagnosis").addEventListener("click", () => {
            inputParametres.diagnosisMain = []; inputParametres.diagnosisComplications = []; inputParametres.diagnosisAccompanyingIllnesses = []
            document.querySelector(".modal-diagnosis").querySelectorAll("input").forEach(input => {
                if (input.name === "main-diagnosis" && input.checked === true) inputParametres.diagnosisMain.push(input.id);
                if (input.name === "complications-diagnosis" && input.checked === true) inputParametres.diagnosisComplications.push(input.id)
                if (input.name === "accompanying-illnesses-diagnosis" && input.checked === true) inputParametres.diagnosisAccompanyingIllnesses.push(input.id)
            })
            simpleModal().open("Диагноз поставлен")
            document.querySelector(".close-game").classList.add("active")
        })
    }
    if (parentClass === 'treatment') {
        document.querySelector('.medicate .left-bar').addEventListener("click", event => {
            setActiveLi(event.target.className)
        })
        document.querySelector(".category-treatment").addEventListener("click", event => {
            setActiveSpan(event.target.className)
        })
        document.querySelector("button.get-treatment").addEventListener("click", () => {
            saveTreatmentInBuffer()
            getMedicateTreatment()
            getNonMedicateTreatment()
            document.querySelector("button.set-treatment").addEventListener("click", () => {
                inputParametres.treatmentMedicate = inputParametres.treatmentMedicateBuffer
                inputParametres.treatmentNonMedicate = inputParametres.treatmentNonMedicateBuffer
                simpleModal().open("Лечение назначено")
            })
            buttonAction("view-treatment")
        })
    }
}

//SIMPLE MODAL SAVE INFO
function simpleModal() {
    return {
        open(text) {
            document.querySelector(".simple-modal-overlay").style.display = 'flex'
            document.querySelector(".simple-modal-body").innerHTML = text
            setTimeout(() => {
                document.querySelector(".simple-modal-overlay").style.display = "none"
            }, 1000)
        }
    }

}

//----------------
//----------------
//END MENU
//---------------
//----------------
;

window.onload = function() {
console.log("Script is working")
inputParametres = {

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
        questionBlock = inputParametres.anamnesisData.shift()
        addQuestion(questionBlock)
    }
    else {
        document.querySelector(".questions").querySelector(".box_body").innerHTML = "Все вопросы заданы."
        document.querySelector(".blinker").style.color = "#99cc00"
    }


    questions = document.querySelectorAll('.question')
    questions.forEach((question, index, arr) => {
        inputParametres.countQuestions = questions.length
        question.addEventListener("click", async event => {
            numberQuestion = question.getAttribute("number")
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
    chartBox = document.querySelector(".chart")
    chartBody = chartBox.querySelector(".box_body")
    chartBody.innerHTML += '<div class="medic">' + message + ' <span>' + getTime() + '</span> </div>'
    scrollToEnd()
}
async function addPatientMesageInChart(message) {

    chartBox = document.querySelector(".chart")
    chartBody = chartBox.querySelector(".box_body")
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
    classCategory = document.querySelector("." + en_category)
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
    chartBody = document.querySelector(".box_body")
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
    questionsBox = document.querySelector(".questions")
    questionsBody = questionsBox.querySelector(".box_body")
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
        id = 'group-' + groupIndex + '-drug-' + i
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

            await requestJson()

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
function diagnosisCheck(parentNode) {
    diagnosisInnerText = '<div class="subcategory">Основной:' +
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
        ru_name = document.querySelector('#' + inputParametres.diagnosisMain[0]).value
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
            ru_name = document.querySelector('#' + complication).value

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
            ru_name = document.querySelector('#' + accompanyingIllnesses).value

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
function getHTMLResult() {
    const css = `<style>body{position:absolute;top:0;bottom:0;left:0;right:0;margin:0;padding:0;background-color:#000;font-family:'Open Sans',sans-serif;box-sizing:border-box}.container{position:relative;margin:auto;width:100vw;min-width:500px;max-width:1920px;height:100%;background-image:url(../images/background.jpg);background-size:cover;background-position:center}.container::before{content:"";display:block;height:100%;background-color:#fff;opacity:.4}.content{position:absolute;top:0;bottom:0;left:0;right:0;display:flex;justify-content:space-around;align-items:flex-end}.box{flex-basis:30%;min-width:200px;margin-bottom:20px;height:90%;display:flex;flex-direction:column;color:#000}.box_header{width:100%;min-height:50px;opacity:.7;display:flex;justify-content:flex-start;align-items:center;border-top-left-radius:25px;border-top-right-radius:25px;background-color:#fff}.box_header>img{padding-left:10px;width:40px;height:40px;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;-ms-border-radius:50%;-o-border-radius:50%}.box_header>.title{padding-left:10px;font-size:18px}.box_header>.title .title__name{display:block;font-size:14px}.box_header>.title .title__dicription{display:block;font-size:12px;font-weight:200;color:rgba(255,255,255,0.7)}.box_body{height:100%;padding:10px;background-color:rgba(255,255,255,0.4);display:flex;flex-direction:column}.chart{color:#fff}.chart>.box_header{background-color:#000}.chart>.box_body{display:flex;flex-direction:column;background-color:rgba(0,0,0,0.4);overflow-y:overlay;padding-bottom:30px}.chart>.box_body>div>span{position:absolute;font-weight:300;right:10px;bottom:3px;font-size:.7em;opacity:.8}.chart>.box_body>.patient{position:relative;align-self:flex-start;background-color:rgba(0,0,0,0.5);padding:10px;padding-bottom:17px;margin-top:10px;margin-left:40px;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;width:70%}.chart>.box_body>.patient::before{content:"";position:absolute;bottom:-10px;left:-45px;width:35px;height:35px;background-image:url(../images/patient.jpg);background-size:cover;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;-ms-border-radius:50%;-o-border-radius:50%}.chart>.box_body>.patient::after{content:"";position:absolute;bottom:0;left:-20px;border:10px solid transparent;border-right:10px solid rgba(0,0,0,0.5);border-bottom:0 solid rgba(0,0,0,0.5)}.chart>.box_body>.medic{position:relative;align-self:flex-end;background-color:rgba(255,255,255,0.8);padding:10px;padding-bottom:20px;margin-top:10px;margin-right:10px;border-top-left-radius:10px;border-bottom-left-radius:10px;border-bottom-right-radius:10px;width:70%;color:#000}.chart>.box_body>.medic::after{content:"";position:absolute;top:0;right:-20px;border:10px solid transparent;border-left:10px solid rgba(255,255,255,0.8);border-top:0 solid rgba(255,255,255,0.8)}.chart>.box_body .load{position:relative;font-size:2em;width:30px;overflow:hidden;white-space:nowrap;overflow:hidden;-webkit-animation:type .5s steps(50,end) infinite;animation:type .5s steps(50,end) infinite}@keyframes type{from{width:0}}@-webkit-keyframes type{from{width:0}}.questions>.box_header{height:40px}.questions>.box_body{display:flex;flex-direction:column;align-items:center;height:auto;max-height:100%;overflow-y:auto}.questions>.box_body>.question{width:85%;margin:7px 0;padding:10px;background-color:rgba(255,255,255,0.8);box-shadow:0 0 10px 5px rgba(0,0,0,0.4);border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;-o-border-radius:10px;cursor:pointer}.questions>.box_body>.question:hover,.questions>.box_body>.question:active{box-shadow:0 0 10px 10px rgba(0,0,0,0.5)}.menu>.box_body{height:auto;max-height:100%}.menu button{position:relative;margin:5px 0;padding-top:10px;padding-bottom:10px;flex-basis:15%;outline:none;border:none;font-size:1.2em;font-weight:400;border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;-o-border-radius:10px;cursor:pointer}.anamnesis,.physical-research,.instrumental-research{position:relative;background:#58cefa}.anamnesis>.blinker{position:absolute;top:-3px;right:2px;color:red;font-size:2em}.anamnesis:hover,.physical-research:hover,.instrumental-research:hover{background:#0aa5dd}.diagnosis,.treatment{background:#9c0}.diagnosis:hover,.treatment:hover{background:#779e02}.menu button.close-game{cursor:default}.menu button.close-game.active{cursor:pointer;background-color:#e66262;color:#fff}.menu button.close-game.active:hover,.menu button.close-game.active:active{background-color:#e44343}.menu>.mobile-menu{display:none}.modal{position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0.5);display:none;flex-direction:column;align-items:center;justify-content:center}.modal>div{width:90%}.modal_header,.modal_footer{display:flex;justify-content:center;align-items:center;height:5vh;min-height:30px;padding:5px 20px;background-color:#f5f5f5}.modal_header{font-size:1.2em;font-weight:700;border-bottom:2px solid #ccc;border-top-left-radius:5vh;border-top-right-radius:5vh}.modal_footer{border-top:2px solid #ccc;border-bottom-left-radius:5vh;border-bottom-right-radius:5vh}.modal_body{height:auto;max-height:70vh;overflow-y:auto;background-color:#fff;padding:20px}.modal_body>span{display:block;width:100%;text-align:center;margin-top:20px;margin-bottom:20px}.modal_body>img{max-width:100%;display:block;margin:0 auto}.modal_body>div>h2{margin-top:20px;margin-bottom:5px}.modal_body>div>p{position:relative;margin:5px;padding-left:20px}.modal_body>div>p::before{content:"•";font-weight:900;position:absolute;left:10px}.modal_body::-webkit-scrollbar{width:10px;background-color:#f9f9fd}.modal_body::-webkit-scrollbar-thumb{border-radius:10px;background-color:#757979}.modal_body::-webkit-scrollbar-track{box-shadow:inset 0 0 6px rgba(0,0,0,0.2);-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.2);border-radius:10px;background-color:#f9f9fd}.modal_footer button{font-size:1em;font-weight:200;margin:0 10px;padding:5px 10px;color:#fff;background-color:#2e75d3;cursor:pointer;outline:none;text-decoration:none;border:none;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px}.modal_footer button:hover{background-color:#064ca8}.modal-body-instrumental-research{display:flex;justify-content:space-around;align-items:flex-start}.modal-body-instrumental-research>.instrument{flex-basis:24%;min-width:150px;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:1.2em;cursor:pointer;padding:20px 0;text-align:center}.modal-body-instrumental-research>.instrument:hover{background-color:rgba(0,0,0,0.5);color:#fff;border-radius:20px;-webkit-border-radius:20px;-moz-border-radius:20px;-ms-border-radius:20px;-o-border-radius:20px}.modal-body-instrumental-research>.instrument>img{display:block;max-width:150px;max-height:150px;width:auto;height:auto;margin-bottom:10px;border-radius:19%;-webkit-border-radius:19%;-moz-border-radius:19%;-ms-border-radius:19%;-o-border-radius:19%}.modal-body-diagnosis{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap}.modal-body-diagnosis>div{width:33%;min-width:300px;margin-bottom:10px}.diagnosis-box>.diagnosis-box__header{line-height:30px;background-color:#ccc;text-align:center;border-top-left-radius:10px;border-top-right-radius:10px}.diagnosis-box>.diagnosis-box__body{padding:10px;border:3px solid #ccc;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.diagnosis-box>.diagnosis-box__body>div{margin-top:10px}.diagnosis-box>.diagnosis-box__body label,.diagnosis-box>.diagnosis-box__body input{cursor:pointer}.modal-treatment{box-sizing:border-box}.modal-body-treatment{display:flex;flex-direction:column}.category-treatment{display:flex;width:100%;min-height:30px;justify-content:space-between;border:3px solid #ccc;border-bottom:0}.category-treatment>span{flex-basis:50%;line-height:30px;background-color:#ccc;text-align:center;cursor:pointer}.category-treatment>span:hover{background-color:rgba(0,0,0,0.7);color:#fff}.category-treatment>span.active{background-color:#fff}.category-treatment>span.active:hover{background-color:#fff;color:#000;cursor:default}.content-treatment{width:100%;border:3px solid #ccc;border-top:0}.medicate{display:flex;width:96%;justify-content:space-between;border:1px solid #ccc;margin:2%}.medicate>.bar{flex-basis:48%;text-align:center}.medicate>.left-bar{margin:0;padding:0}.medicate>.left-bar ul{margin:0;padding:0}.medicate>.left-bar li{list-style-type:none;padding:5px 0;border:1px solid #ccc;background-color:rgba(0,0,0,0.1);cursor:pointer}.medicate>.left-bar li:hover{background-color:rgba(0,0,0,0.4)}.medicate>.left-bar li.active{background-color:#fff;border:1px solid transparent}.medicate>.left-bar li.active:hover{background-color:#fff;cursor:default}.medicate>.right-bar{border-left:0;text-align:left;padding:1%}.medicate>.right-bar .drug{padding:10px 0;border-bottom:1px dashed #ccc}.medicate>.right-bar .drug>label{cursor:pointer;margin-left:10px;word-wrap:break-word;hyphens:auto;-moz-hyphens:auto;-ms-hyphens:auto;-webkit-hyphens:auto}.non-medicate{display:none;flex-direction:column;margin:2% 10%}.non-medicate>.non-medicate-radio{padding:10px 0;border-bottom:1px dashed #ccc}.non-medicate>.non-medicate-radio>label{cursor:pointer;margin-left:10px}.modal-body-finish>.category{width:90%;padding:10px;border-bottom:2px dashed #ccc}.modal-body-finish>.category>h2{margin:0;font-size:1.4rem;font-weight:500;color:#00008b}.modal-body-finish>.category .subcategory{position:relative;margin-top:10px;margin-left:30px;font-size:1.2rem;font-weight:500;color:#00008b}.modal-body-finish>.category .wrong-message,.modal-body-finish>.category .message{position:relative;margin-top:10px;margin-left:30px;font-size:1rem;font-weight:500;color:#8b0000}.modal-body-finish>.category .wrong-message{font-style:italic;font-weight:900}.modal-body-finish>.category .message{color:#000}.modal-body-finish>.category .wrong{position:relative;margin-left:10px;padding-bottom:5px;font-weight:700;color:#8b0000}.modal-body-finish>.category .correctly{margin-left:10px;padding-bottom:5px;font-weight:700;color:#008b3a}.simple-modal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0.4);display:none;flex-direction:column;align-items:center;justify-content:center}.simple-modal-body{background-color:#c4f7c2;max-width:90%;width:auto;padding:10px;border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;-o-border-radius:10px}@media screen and (orientation:portrait){.container{min-width:300px;height:100%}.container::before{padding-top:0}.content{height:100%}.box{flex-basis:45%;margin-bottom:20px}.box.menu{position:fixed;margin-bottom:0;min-height:100%;max-height:100%;top:-100%;bottom:100%;transform:translateY(40px);left:0;right:0;background-color:rgba(255,255,255,1);display:flex;flex-direction:column;align-items:stretch;justify-content:stretch;transition:1s;-webkit-transition:1s;-moz-transition:1s;-ms-transition:1s;-o-transition:1s;-webkit-transform:translateY(40px);-moz-transform:translateY(40px);-ms-transform:translateY(40px);-o-transform:translateY(40px)}.box.menu.mob-open{top:0;bottom:0;transform:translateY(0px);-webkit-transform:translateY(0px);-moz-transform:translateY(0px);-ms-transform:translateY(0px);-o-transform:translateY(0px)}.box.menu>.box_header{display:none}.box.menu>.box_body{height:100%}.box.menu>.mobile-menu{display:flex;justify-content:center;align-items:center;position:relative;min-height:40px;width:100vw;background:#000}.arrow{position:relative;cursor:pointer;width:66px;height:30px}.arrow-left{position:absolute;background-color:transparent;top:10px;left:0;width:40px;height:10px;display:block;transform:rotate(35deg);float:right;border-radius:2px}.arrow-left:after{content:"";background-color:#fff;width:40px;height:10px;display:block;float:right;border-radius:6px 10px 10px 6px;transition:all .5s cubic-bezier(0.25,1.7,0.35,0.8);z-index:-1}.arrow-right{position:absolute;background-color:transparent;top:10px;left:26px;width:40px;height:10px;display:block;transform:rotate(-35deg);float:right;border-radius:2px}.arrow-right:after{content:"";background-color:#fff;width:40px;height:10px;display:block;float:right;border-radius:10px 6px 6px 10px;transition:all .5s cubic-bezier(0.25,1.7,0.35,0.8);z-index:-1}.open .arrow-left:after{transform-origin:center center;transform:rotate(-70deg)}.open .arrow-right:after{transform-origin:center center;transform:rotate(70deg)}}@media screen and (max-width: 1024px){.modal-body-diagnosis{justify-content:center}.modal-body-diagnosis>div{width:95%}}@media screen and (max-width: 768px){.box{min-width:160px}.chart,.questions{font-size:.8em}.chart>.box_body>.patient{margin-left:20px}.chart>.box_body>.patient::before{bottom:-7px;left:-25px;width:15px;height:15px}.questions>.box_body>.question{margin:3px 0;padding:10px 5px;font-size:1.2em}.menu button{padding:10px}.modal-body-instrumental-research{flex-wrap:wrap;padding-top:2px}.modal-body-instrumental-research>.instrument{flex-basis:24.5%;min-width:105px;font-size:.9em}.modal-body-instrumental-research>.instrument>img{width:90%}.medicate{width:98%;margin:1%}}@media screen and (max-width: 500px) and (orientation:portrait){.container{min-width:320px}.content{flex-direction:column;align-items:flex-end}.box{margin-bottom:0;width:100%;height:50%}.box.chart{margin-top:40px;flex-basis:100%}.box.questions{flex-basis:auto;min-height:200px}.box.questions>.box_header{height:40px;min-height:40px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;-o-border-radius:0}.box.questions>.box_body{min-height:160px}}@media screen and (max-width: 420px){.modal_header.modal-instrumental-research{font-size:1em}.modal-body-instrumental-research{flex-wrap:wrap}.modal-body-instrumental-research>.instrument{flex-basis:24.5%;min-width:65px;font-size:.6em}.modal-body-treatment{font-size:.8em}.medicate>.right-bar .drug{display:flex;align-items:center}.medicate>.right-bar .drug>label{cursor:pointer;margin-left:2px}.modal-footer-treatment>button{font-size:.9em;padding:5px}}@media screen and (max-height: 600px){.container{min-height:300px}.box.menu .box_header,.box.questions .box_header{height:30px;min-height:30px}.box.menu button{font-size:.8em;margin:3px;padding-top:5px;padding-bottom:5px}}</style>`
    const HTMLResult = document.querySelector('.modal.modal-finish').innerHTML
    return css + '<div class="modal modal-finish" style="display: flex;">' + HTMLResult + '</div>'
}

};

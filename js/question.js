let requestURL = "data/questions.json";
let request = new XMLHttpRequest();
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
const question = request.response;  
let questions =  ((false || !!document.documentMode))? JSON.parse(question): question;

            let question_order = ['Sponsored Programs Administration \r\n(Pre and Post Award)',
            'RF-Human Resources', 
            'Regulatory and Research Compliance - Human Subjects Studies (IRB)',
            'Regulatory and Research Compliance - Animals use in Research and Teaching (IACUC and LAR)',
            'Grants & Faculty Development',
            'Innovation and Commercialization',       
            'Business Development '];

            let sub_question_order = 
            ['What plans are in place to ensure that the animals housed on campus will continue to receive care?',
            'Will there be any disruption to the Institutional Animal Care & Use Committee, and the review of protocols during the COVID-19 situation?',
            'Can I still access the animals in my facility?',
            'What can I do now to prepare for the possibility that the COVID-19 situation disrupts my animal experiments?',
            'What are the best methods for us to reduce our animal breeding colonies?',
            'How do I identify my critical/high-priority (20%) preserve animals at the cage level?'];
            let content = '';
            //Department-counter for unique id generation
            let questionCounter = 1;
            //finding list of distinct departments
            let distinctQuestionTypes = getDistinctAttributes(questions, "questionType");
            distinctQuestionTypes = customSort(question_order, distinctQuestionTypes);
            //Iterating over list of departments
            distinctQuestionTypes.forEach(function(questionType){
                let categoryQuestions = questions.filter(function(question){ 	
                    return question.questionType == questionType;
                });
                questionType = (questionType == 'Regulatory and Research Compliance - Animals use in Research and Teaching (IACUC and LAR)')? 
                'Animals use in Research and Teaching (IACUC and LAR)': questionType;
                //getting list of distint degrees within department
                let uniqueQuestions = getDistinctAttributes(categoryQuestions, "question");
                if(questionType == 'Animals use in Research and Teaching (IACUC and LAR)')
                {
                    uniqueQuestions = customSort(sub_question_order, uniqueQuestions);
                }
                let accordionContent = generateSubAccordionContent(uniqueQuestions, "question", categoryQuestions, generateQuestionContent);
                
                //generating Id for bootstrap accordion
                let questId = "collapse" + questionCounter;
                let headingId = "heading" + questionCounter;
                let accordionElem =  generateAccordionElem(questId, headingId, questionType, accordionContent);
                content = content + accordionElem;
                questionCounter++;
            });
            //Appending content to DOM
            appendMainContent(maincontentContainer, content);
    }

    let generateQuestionContent = function(question){
        let questionContent =  '<div class = "FAQ-container search-container"><p style = "display: none;">'+ question.question+'</p><p class = "answer">'+  question.answer + '</p></div>'; 
        return questionContent;
    }
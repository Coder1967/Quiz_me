function parser(response) {
    response = response[0].message.content;
    response = response.split('\n');
    let i = 1;
    let list = []
    let quiz = {questions: [], answers: [], options: []}

    for (let data of response) {
            if (/^\d\..{10,}|^\d\).{10,}/.test(data)) {
                    quiz.questions.push(data);
            }
            else if (/^\d\.|^\d\)/.test(data)) {
                    quiz.answers.push(data);
            }
            else if (/^[a-dA-D]\.|^[a-dA-D]\)/.test(data)) {
                    list.push(data);
                    if (i === 4) {
                    quiz.options.push((list));
                    list = []
                    i = 1;
                    continue;
                    }
                    i++;
            }
    }
    return quiz;
}
module.exports = parser;

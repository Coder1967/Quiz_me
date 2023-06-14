require("dotenv").config();

const { Configuration, openAIApi, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});

const API_MODEL = process.env.API_MODEL || "gpt-3.5-turbo";
const openai = new OpenAIApi(configuration);

async function aiCall(course, limit=15) {
    	try {
        	const response = await openai.createChatCompletion({
            	"model": API_MODEL,
            	"messages": [{"role":"system", "content": `You must always add the answer at the end of the entire request labelled 1 t0 ${limit} each one being the answer to each question asked`},

                	{"role": "system", "content": "always give a list of options from a to d for the user to pick from."},
			{"role": "system", "content": `questions should always be formatted as 
			1. what is the name of the tallest mountain?
			a. everest b. kilimanjaro  c. lobo d. contno
			2. what is the fastest land animal?
			a. whale b. gorilla c. cheetah d. penguin
			3. what is the fedral capital territory?
			a. georgia b. abuja c. moscow d. tokyo

			Answers:
			1. a
			2. c
			3. b
				`},
                	{"role": "user", "content": `generate ${limit} objective style questions on the course titled ${course}`},
            ]
        })
	 return response.data.choices;

    } catch (error) {
        console.log(error.message);        
    }
}
module.exports = aiCall;

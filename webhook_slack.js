const request = require('request-promise');

const hook = 'T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'

const getData = async function() {
  const json = await request({
    url: 'https://next.json-generator.com/api/json/get/NJmmK3pV',
    json: true,
  });

  return json.map(person => ({
    age: person.age,
    email: person.email,
    firstName: person.name.first,
    lastName: person.name.last,
  }));
}

(async function(params) {
  try {
    const people = await getData();

    const slackBody = {
      mkdwn: true,
      text: `<!channel> This is a really great message!`,
      attachments: people.map(person => ({
        color: 'good',
        text: `*${person.email}* and their name is ${person.firstName} ${person.lastName}, and they are ${person.age}`,
      })),
    }
   
    const res = await request({
      url: `https://hooks.slack.com/services/${hook}`,
      method: 'POST',
      body: slackBody,
      json: true
    });

    console.log(res);

  } catch (error) {
    console.log('ERROR', error)
  }
})();
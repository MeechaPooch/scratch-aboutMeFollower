const info = {
    username: 'ilhp10',
    password: 'secret!'
}
let auth = {
    ready: false,
}


/////////// run /////////

await login()

let lastSet = null;
async function doCycle() {
    if(!auth.ready) { return }
    let username = (await getLatestFollower(info.username)).username;
    if(lastSet==username) { return }

    try { setAbtMeFollower(username); lastSet = username; console.log('new follower:',username) }
    catch (e) {console.error(e); login() }
}
setInterval(doCycle, 1000)



////////// functions ///////////


function loginRequest() {
    return fetch("https://scratch.mit.edu/accounts/login/", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrftoken": "a",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "scratchcsrftoken=a; permissions=%7B%7D",
            "Referer": "https://scratch.mit.edu/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"username\":\"${info.username}\",\"password\":\"${info.password}\",\"useMessages\":true}`,
        "method": "POST"
    });
}
function sessionRequest() {
    return fetch("https://scratch.mit.edu/session/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": auth.cookie,
    "Referer": "https://scratch.mit.edu/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});
}
async function login() {
    auth.ready = false;
    let res = await loginRequest()
    let json = await res.json()

    auth.token = json.token;
    auth.sessionIdCookie = await res.headers.getSetCookie()[0].split(' ')[0]
    auth.cookie = auth.sessionIdCookie + ' scratchcsrftoken=a; permissions=%7B%7D;'

    res = await sessionRequest()
    json = await res.json()

    auth.cookie = auth.sessionIdCookie + ' scratchcsrftoken=a; permissions=' + encodeURIComponent(JSON.stringify(json.permissions)) + ';'
    auth.ready = true;
}

function setAboutMe(text) {
    return fetch(`https://scratch.mit.edu/site-api/users/all/${info.username}/`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrftoken": "a",
            "x-requested-with": "XMLHttpRequest",
            "cookie":auth.cookie,
            // "cookie": "scratchsessionsid=\".eJxVj8FugzAQRP-Fc0sNeIOdW7i2yiFqK_WEbO8SHMBGYBqpVf-9tsQl15ndNzO_2bbS4tRE2TGzYz8XLHvKgh_IRUEqcdDAGBgmeXdALTiWHcgaRE2ypOObarZPg836Hbp3MGe0ON6K-TK9fkTM6K_WPds5kgpZ5jIveJWDjE6rttC3Kbq1GG1gsq45jw7elLv6NtiJfrxLrU4TLdaolzPd2y-_DI_vvVr7eIQgRIWaalnyCpkSZcWx4h0IrhUAAyi0kFqlcbQG4_1gE_wegYSPSK1MnJ9qJY1ciOnBepfvxppfaB53sdmP__4BG4lqZQ:1qHLFp:SqoRTqYyJex5NWBPJ9QFjmSgDsY\"; scratchcsrftoken=tlWWgd5lP7KV6Q3ee7zzTCrqodWmHXgp; permissions=%7B%22admin%22%3Afalse%2C%22scratcher%22%3Atrue%2C%22new_scratcher%22%3Afalse%2C%22invited_scratcher%22%3Afalse%2C%22social%22%3Atrue%2C%22educator%22%3Afalse%2C%22educator_invitee%22%3Afalse%2C%22student%22%3Afalse%2C%22mute_status%22%3A%7B%7D%7D",
            "Referer": "https://scratch.mit.edu/users/ilhp10/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        // "body": "{\"id\":4266794,\"userId\":5097744,\"username\":\"ilhp10\",\"thumbnail_url\":\"//uploads.scratch.mit.edu/users/avatars/5097744.png\",\"comments_allowed\":true,\"bio\":\"most recent follower: @-BananaCool-\\ni made blocklive\\n\\nfav music:\\ntalking book by stevie wonder\\nlittle joy by little joy\\nmeechapooch.github.io/mymusic/painsfaves\\n\\npfp by @tntsquirrel\",\"featured_project_label_name\":\"Why I Scratch\",\"featured_project_data\":{\"creator\":\"ilhp10\",\"thumbnail_url\":\"//uploads.scratch.mit.edu/projects/thumbnails/509531164.png\",\"id\":509531164,\"datetime_modified\":\"2023-07-06T09:33:31\",\"title\":\"This project has 103,590 VIEWS\"},\"featured_project\":509531164,\"user\":{\"username\":\"ilhp10\",\"pk\":5097744},\"featured_project_label_id\":4}",
        "body": JSON.stringify({ bio: text }),
        "method": "PUT"
    });
}
function followersRequest(user,limit) {
    if(!limit) {limit = 20}
    return fetch(`https://api.scratch.mit.edu/users/${user}/followers?limit=${limit}&rand=${Math.random()}`);
}
async function getLatestFollower(user) {
    return (await (await followersRequest(user,1)).json())[0]
}

function setAbtMeFollower(follower) {
    return setAboutMe(`most recent follower: @${follower}
i made blocklive

fav music:
talking book by stevie wonder
little joy by little joy

pfp by @tntsquirrel`)
}
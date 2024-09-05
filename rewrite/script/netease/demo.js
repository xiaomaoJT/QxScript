const crypto = require('crypto')
const parse = require('url').parse
const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const eapiKey = Buffer.from('e82ckenh8dichen8')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'

const aesEncrypt = (buffer, mode, key, iv) => {
	const cipher = crypto.createCipheriv(`AES-128-${mode}`, key, iv)
	return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const aesDecrypt = (buffer, mode, key, iv) => {
	const decipher = crypto.createDecipheriv(`AES-128-${mode}`, key, iv)
	return Buffer.concat([decipher.update(buffer), decipher.final()])
}

const rsaEncrypt = (buffer, key) => {
	buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
	return crypto.publicEncrypt({key: key, padding: crypto.constants.RSA_NO_PADDING}, buffer)
}

module.exports = {
	encrypt: {
		weapi: (url, object) => {
			url = parse(url)
			const text = JSON.stringify(object)
			const secretKey = crypto.randomBytes(16).map(n => (base62.charAt(n % 62).charCodeAt()))
			return {
				url: url.href.replace(/\w*api/, 'weapi'),
				body: {
					params: aesEncrypt(Buffer.from(aesEncrypt(Buffer.from(text), 'CBC', presetKey, iv).toString('base64')), 'CBC', secretKey, iv).toString('base64'),
					encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex')
				}
			}
		},
		linuxapi: (url, object) => {
			url = parse(url)
			const text = JSON.stringify({method: 'POST', url: url.href, params: object})
			return {
				url: url.resolve('/api/linux/forward'),
				body: {
					eparams: aesEncrypt(Buffer.from(text), 'ECB', linuxapiKey, '').toString('hex').toUpperCase()
				}
			}
		},
		eapi: (url, object) => {
			url = parse(url)
			const text = JSON.stringify(Object.assign(object, {e_r: 'false'}))
			const message = `nobody${url.path}use${text}md5forencrypt`
			const digest = crypto.createHash('md5').update(message).digest('hex')
			const data = `${url.path}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
			return {
				url: url.href.replace(/\w*api/, 'eapi'),
				body: {
					params: aesEncrypt(Buffer.from(data), 'ECB', eapiKey, '').toString('hex').toUpperCase()
				}
			}
		}
	},
	decode: id => {
		const key = '3go8&$8*3*3h0k(2)2'
		const string = Array.from(Array(id.length).keys()).map(index => String.fromCharCode(id.charCodeAt(index) ^ key.charCodeAt(index % key.length))).join('')
		const result = crypto.createHash('md5').update(string).digest('base64').replace(/\//g, '_').replace(/\+/g, '-')
		return `http://p2.music.126.net/${result}/${id}`
	}
}
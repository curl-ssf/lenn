const { tiktok } = require('../start/lib/function/tiktok')

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} https://vt.tiktok.com/ZS6ThFced/\n`)
    
    let res = await tiktok(text)
    await reaction(m.chat, "⚡")

    if (res && res.data && res.data.success) {
        let data = res.data
        let type = data.type
        let urls = data.urls || []
        
        if (type === 'video' && urls.length > 0) {
            let videoUrl = urls[0]
            await client.sendMessage(m.chat, {
                video: { url: videoUrl },
                caption: "berhasil mengunduh video dari tiktok"
            }, { quoted: m })

        } else if (type === 'slideshow' && Array.isArray(urls)) {
            let totalImages = urls.length
            let estimatedTime = totalImages * 4
            let message = `estimasi waktu pengiriman gambar: ${estimatedTime} detik.`
            await client.sendMessage(m.chat, { text: message }, { quoted: m })

            let albumArray = urls.map((url, index) => ({
                image: { url },
                caption: `gambar ke-${index + 1}`
            }))

            await client.albumMessage(m.chat, albumArray, m)
        } else {
            await reply("tidak ditemukan media yang valid.")
        }
    } else {
        console.error(res)
        await reply("hayya, error")
    }
}

handler.help = ['downloader tiktok']
handler.tags = ['downloader']
handler.command = ["tiktok"]

module.exports = handler

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { create } from 'sulla';
import { writeFileSync  } from 'node:fs';

export default class WhatsappsController {
    public async index({ auth, response }){
        try {
            await auth.use('api').authenticate()
            if(!auth.use('api').isAuthenticated)
                return response.badRequest({ code: 400, message: 'Mohon login terlebih dahulu.' })
            create('sessionName', (base64Qr, asciiQR) => {
                // To log the QR in the terminal
                console.log(asciiQR);
            
                // To write it somewhere else in a file
                this.exportQR({ qrCode: base64Qr, path: 'marketing-qr.png' });
            }, {
                headless: true, // Headless chrome
                devtools: false, // Open devtools by default
                useChrome: true, // If false will use Chromium instance
                debug: false, // Opens a debug session
                logQR: true, // Logs QR automatically in terminal
                browserArgs: [''], // Parameters to be added into the chrome browser instance
                refreshQR: 15000, // Will refresh QR every 15 seconds, 0 will load QR once. Default is 30 seconds
            }).then((client) => {
                client.onMessage((message) => {
                    console.log(message)
                });
            })
        } catch (error) {
            response.badRequest({code: 400, message: error?.responseText || error?.code})
        }
    }

    exportQR({ qrCode, path }: { qrCode; path; }) {
        qrCode = qrCode.replace('data:image/png;base64,', '');
        const imageBuffer = Buffer.from(qrCode, 'base64');
      
        // Creates 'marketing-qr.png' file
        writeFileSync(path, imageBuffer);
    }
}

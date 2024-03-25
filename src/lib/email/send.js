import nodemailer from 'nodemailer';
import smtpConfig from '../../config/smtp.config.js';
import fs from 'fs';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import juice from 'juice';
import { CreateError, CreateSuccess } from '../../utils/responseHandler.js';

const smtp = nodemailer.createTransport({
    host: smtpConfig.smtp.host,
    port: smtpConfig.smtp.port,
    auth:{
        user: smtpConfig.smtp.username,
        pass: smtpConfig.smtp.password
    }
});

const mailSent = async({
    template,
    templateVars,
    newToken,
    ...restOfOptions
}) => {
    try{
        var templateName = template;
    
        const templatePath = `./src/lib/email/templates/${templateName}.html`;
        const headerTemplatePath = `./src/lib/email/templates/header.html`;
        const footerTemplatePath = `./src/lib/email/templates/footer.html`;

        restOfOptions.from = smtpConfig.support.email;

        const options = {
            ...restOfOptions
        }

        if (
            templateName &&
            fs.existsSync(headerTemplatePath) &&
            fs.existsSync(footerTemplatePath) &&
            fs.existsSync(templatePath)
        ) {

            const headerTemplate = fs.readFileSync(headerTemplatePath, "utf-8");
            const footerTemplate = fs.readFileSync(footerTemplatePath, "utf-8");
            const template = fs.readFileSync(templatePath, "utf-8");
            const fullTemplate = headerTemplate + template + footerTemplate;

            const html = ejs.render(fullTemplate, templateVars);
            const text = htmlToText(html);
            const htmlWithStylesInlined = juice(html);

            options.html = htmlWithStylesInlined;
            options.text = text;
            await smtp.sendMail(options);
            await newToken.save();
            return true;
            // return smtp.sendMail(options);
            // return smtp.sendMail(options, async(err, data)=>{
            //     if(err){
            //         return CreateError(500, 'Something went wrong while sending the email!');
            //     }else{
            //         await newToken.save();
            //         return CreateSuccess(200, "Email sent Successfully!");
            //     }
            // });
        }else{
            console.log("File not exists...." + templatePath);
        }    
    }catch(error){
        console.error('Error sending email:', error);
        // CreateError(500, "Error sending email");
        // Handle the error appropriately
        return false;

    }
    
}

export default mailSent;
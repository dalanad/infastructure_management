import * as nodemailer from "nodemailer";
import nunjucks from "nunjucks";
import { join } from "path";

export interface IEmailService {
	send(to: string, subject: string, template: string, data: object);
}

let nodemailerConfiguration = {
	host: "smtp.sendgrid.net",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: "apikey",
		pass: "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",
	},
};

export class NodemailerService implements IEmailService {
	transport = nodemailer.createTransport(nodemailerConfiguration);
	env = new nunjucks.Environment(new nunjucks.FileSystemLoader(join(__dirname, "../../../views/emails")), {
		watch: true,
	});

	constructor() {}

	send(to: string, subject: string, template: string, data: object) {
		let html = this.env.render(template + ".njk", data);
		this.transport.sendMail({ from: '"Zismith" <system@zismith.com>', to, subject, html });
	}
}

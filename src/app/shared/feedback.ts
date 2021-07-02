export class Feedback {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agreed: boolean;
    contacttype: string;
    message: string;
}

export const ContactType = ['None', 'Tel', 'Email'];
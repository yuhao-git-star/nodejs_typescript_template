import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

export interface IUserModel extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    picture: string;
    created: Date;
}

export const schema = new Schema({

    email: { type: String, unique: true, lowercase: true },
    name: String,
    password: String,
    picture: String,
    created: { type: Date, default: Date.now }
});

export class User {

    public userModel: mongoose.Model<IUserModel>;

    constructor() {
        this.initUserSchemaSet();
        this.userModel = mongoose.model('User', schema);
    }

    private initUserSchemaSet(): void {
        // hash password
        schema.pre<IUserModel>('save', function (next) {

            var user = this;

            if (!user.isModified('password')) return next();

            bcrypt.hash(user.password, null, null, function (err, hash) {

                user.password = hash;
                next();
            });

        });
    }

    /**
     * 
     * @param password post password
     * @param user hash password
     */
    public static comparePassword(password: string, user: IUserModel): boolean {
        return bcrypt.compareSync(password, user.password);
    }

    /**
     * 
     * @param user user mail
     * @param size size
     */
    public static gravatar(user: IUserModel, size?: number): string {
        if (!size) size = 200;
        if (!user.email) {
            return 'https://gravatar.com/avatar/?s' + size + '&d=retro'
        } else {
            var md5 = crypto.createHash('md5').update(user.email).digest('hex');
            return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro';
        }
    }
}

export const UserSchema = new User().userModel;


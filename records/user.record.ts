import passwordValidator from 'password-validator';
import {NewUserEntity, UserEntity, UserType} from "../types";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {handleId} from "../utils/validation";

const schema = new passwordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements NewUserEntity {
    public id: string;
    public email: string;
    public password: string;
    public userType: UserType;
    public refreshToken: string;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewUserEntity) {

        if (!obj.email || typeof obj.email !== "string" || obj.email.length > 50 || !obj.email.includes('@')) {
            throw new ValidationError('Invalid email address!');
        }

        if (obj.password === null || obj.password === undefined || typeof obj.password !== "string" || !schema.validate(obj.password)) {
            throw new ValidationError('Invalid password.');
        }

        this.id = obj.id;
        this.email = obj.email;
        this.password = obj.password;
        this.userType = UserType[obj.userType] ? obj.userType : UserType.Production;
        this.refreshToken = obj.refreshToken ? obj.refreshToken : '';
        this.createTime = obj.createTime ? obj.createTime : new Date();
        this.lastChangeTime = obj.lastChangeTime ? obj.lastChangeTime : new Date();
    }

        static async getOne(email: string, idInstOfEmail = false): Promise<UserRecord | null> {
            if (!idInstOfEmail && typeof email !== 'string') {
                throw new ValidationError('Invalid email!');
            } else if (typeof email !== 'string') {
                throw new ValidationError('Invalid id!');
            }

            const [results] = idInstOfEmail ?
                await pool.execute("SELECT * FROM `users` WHERE `id` = :id", { id: email }) as UserRecordResults
                : await pool.execute("SELECT * FROM `users` WHERE `email` = :email", { email }) as UserRecordResults;

            return results.length === 0 ? null : new UserRecord(results[0]);
        }

        static async getAll(): Promise<UserRecord [] | []> {
            const [results] = await pool.execute("SELECT * FROM `users`") as UserRecordResults;

            return results.map((result) => {
                const {
                    id, email, password, userType, refreshToken, createTime, lastChangeTime
                } = result;
                return new UserRecord({
                    id, email, password, userType, refreshToken, createTime, lastChangeTime
                })
            });
        }

        async insert(): Promise<UserRecord> {
            this.id = handleId(this.id);
            const emails = (await UserRecord.getAll()).map(user => user.email);

            if (emails.includes(this.email)) {
                throw new ValidationError('User with given email already exists!')
            }

            this.createTime = new Date();
            this.lastChangeTime = new Date();

            await pool.execute("INSERT INTO `users`(`id`, `email`, `password`, `userType`, `refreshToken`, `createTime`, `lastChangeTime`) VALUES (:id, :email, :password, :userType, :refreshToken, :createTime, :lastChangeTime)", this);

            return this;
        }

        async update(): Promise<UserRecord> {
            this.lastChangeTime = new Date();
            await pool.execute("UPDATE `users` SET `email` = :email, `password` = :password, `userType` = :userType, `refreshToken` = :refreshToken, `lastChangeTime` = :lastChangeTime WHERE `id` = :id", {
                id: this.id,
                email: this.email,
                password: this.password,
                userType: this.userType,
                refreshToken: this.refreshToken,
                lastChangeTime: this.lastChangeTime,
            });
            return this;
        }

        async delete(): Promise<UserRecord> {
            this.lastChangeTime = new Date();
            await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
                id: this.id,
            });
            return this;
        }

    }

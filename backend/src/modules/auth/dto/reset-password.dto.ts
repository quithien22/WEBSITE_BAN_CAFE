import { IsString , Matches, MaxLength, MinLength} from "class-validator";


export class ResetPassword {
    @IsString()
    token: string;
    @IsString()
    @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
    @MaxLength(72)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: 'Mật khẩu cần có cả chữ và số',
    })
    newPassword: string
}
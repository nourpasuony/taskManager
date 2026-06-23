import bcrypt from "bcrypt";


export const hashValue  = async (value: string , saltRounds : number = 10)=> {
    return await bcrypt.hash(value, saltRounds);
}


export const compareValue = (value: string , hashedValue: string ) : Promise<boolean>=> {
    return bcrypt.compare(value, hashedValue);
}
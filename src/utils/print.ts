export async function print(text: any, isToPrint: boolean){
    if(isToPrint){
        return console.log(text)
    }
    return
}

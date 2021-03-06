const mongoose = require('mongoose')


class Verify {

    constructor(emailcriador, emailuser, arraypermissions, flag){
        this.emailcriador = emailcriador
        this.emailuser = emailuser
        this.permissions = arraypermissions
        this.deletoredit = flag
    }

    verifyPermissions(){
        

        if(this.emailcriador == this.emailuser && this.emailcriador != undefined || this.emailcriador != null){
            return true
        }else{
            var permission = this.deletoredit

            var allPermPos = this.permissions.indexOf('*')
            var permissionPos = this.permissions.indexOf(permission)

            

            if(allPermPos < 0 && permissionPos < 0){
                return false
            }else{
                return true
                
            }
        }
    }

    
}



module.exports = { Verify }
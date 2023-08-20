const bcrypt =  require('bcryptjs');

const hashPassword = async(password)=>{


    // ! salt is like a key
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt)

    // ! return the hashed password
    return hash;
}



const matchPassword = (password,hashedPassword)=>{

return bcrypt.compare(password,hashedPassword);

}





module.exports = {hashPassword,matchPassword}
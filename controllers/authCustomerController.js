// Authentication for customer signup and signin
import models from "../models";
import bcrypt from "bcryptjs";

const signup = async (req, res, next) => {
  // destructruing data from the user
  const { firstname, lastname, password, confirm_password, email, phone_number, gender } = req.body;

  if (!firstname || !lastname || !password || !confirm_password ||!email || !phone_number || !gender) {
    return res.status(400).json({
      status: 400,
      message: "All fields are required"
    });
  }
  if (firstname.match(/^[a-z]/i))
  {
    return res.status(400).json({
      status: 400,
      message: "firstname and lastname must  be alphabets"
    });
  }
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    return res.status(400).json({
      status: 400,
      message: 'Email do not match correct format',
    });
  }
  const phoneNumStr = phone_number.split('');
  if (phoneNumStr.length !== 11 || phone_number.match(/[^0-9]/g)) {
    return res.status(400).json({
      status: 400,
      message: 'Phone number must be a number equal to 11 numbers',
    });
  }
  if(password !== confirm_password){
    return res.status(400).json({
      status: 400,
      message: 'password must match'
    })
  }
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const checkExist = await models.customers.findOne({
        where: {email}
      });
      console.log("Check if it exist here", checkExist)
      if(checkExist){
        return res.status(400).json({
          status: 400,
          message: "Email taken choose another email"
        })
      }
      // submit data if all information are valid

      const customer = await models.customers.create({
        firstname,
        lastname,
        password: hashedPassword,
        email,
        phone_number,
        gender,
        role: 'user',
      });
// If account creation is successful return a success message and the data
      if(customer){
        return res.status(200).json({
          status: 200,
          message: "Your account has been successfully created",
          user: customer
        });
      }
      return res.status(500).json({
        status: 500,
        message: 'Unable to create an account at this time, try again'
      })
    } catch (error) {
      return next(error);
    }
  
};

export { signup };

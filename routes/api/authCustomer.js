import { Router } from "express";
import  {signup} from "../../controllers/authCustomerController";
const router = Router();



router.post("/signup", signup);

export default router;

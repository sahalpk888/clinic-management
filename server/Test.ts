import "dotenv/config";

import { doctor_dashService } from "./src/services/doctorService.js";


const run = async () => {
    try {
        await doctor_dashService();
    } catch (error) {
        console.error(error);
    }
};

run();
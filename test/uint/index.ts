import { baseContext } from "../shared/contexts"
import { unitTestVesting } from "./Vesting"

baseContext("Unit Tests", function() {
    unitTestVesting()
})
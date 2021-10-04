import { ObjectUtil } from "./utils/ObjectUtil";

export class AgeCalculation {
  public static calculateAge(dob) {
    if (ObjectUtil.isEmpty(dob)) {
      return "";
    }
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    let age = Math.floor(difference / (1000 * 3600 * 24) / 365);
    return age;
  }
}

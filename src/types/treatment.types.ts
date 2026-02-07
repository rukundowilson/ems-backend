export enum TreatmentServiceType {
  SINUS_COUGH_ALLERGY = 'Sinus, Cough & Allergy',
  WOMENS_HEALTH = "Women's Health",
  EYE_EAR = 'Eye & Ear',
  KIDS_HEALTH = "Kids' Health",
  SKIN_RASHES = 'Skin & Rashes',
  SEXUAL_HEALTH_STI = 'Sexual Health / STI',
  FLU = 'Flu'
}

export interface TreatmentService {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTreatmentServiceDTO {
  name: string;
  description: string;
  date: string;
  time: string;
}

export interface UpdateTreatmentServiceDTO {
  name?: string;
  description?: string;
  date?: string;
  time?: string;
}

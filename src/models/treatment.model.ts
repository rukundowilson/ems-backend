import { CreateTreatmentServiceDTO, UpdateTreatmentServiceDTO } from '../types/treatment.types';
import TreatmentServiceSchema, { ITreatmentService } from './treatment.schema';

class TreatmentServiceModel {
  async create(data: CreateTreatmentServiceDTO): Promise<ITreatmentService> {
    const service = new TreatmentServiceSchema(data);
    return await service.save();
  }

  async findAll(): Promise<ITreatmentService[]> {
    return await TreatmentServiceSchema.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ITreatmentService | null> {
    return await TreatmentServiceSchema.findById(id);
  }

  async update(id: string, data: UpdateTreatmentServiceDTO): Promise<ITreatmentService | null> {
    return await TreatmentServiceSchema.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await TreatmentServiceSchema.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new TreatmentServiceModel();

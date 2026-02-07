import { Request, Response } from 'express';
import TreatmentServiceModel from '../models/treatment.model';
import { CreateTreatmentServiceDTO, UpdateTreatmentServiceDTO } from '../types/treatment.types';

export const createTreatmentService = async (req: Request, res: Response) => {
  try {
    const data: CreateTreatmentServiceDTO = req.body;
    const service = await TreatmentServiceModel.create(data);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create treatment service' });
  }
};

export const getAllTreatmentServices = async (req: Request, res: Response) => {
  try {
    const services = await TreatmentServiceModel.findAll();
    res.status(200).json({ success: true, data: services, count: services.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch treatment services' });
  }
};

export const getTreatmentServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });
    const service = await TreatmentServiceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Treatment service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch treatment service' });
  }
};

export const updateTreatmentService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });
    const data: UpdateTreatmentServiceDTO = req.body;
    const service = await TreatmentServiceModel.update(id, data);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Treatment service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update treatment service' });
  }
};

export const deleteTreatmentService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });
    const deleted = await TreatmentServiceModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Treatment service not found' });
    }
    res.status(200).json({ success: true, message: 'Treatment service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete treatment service' });
  }
};

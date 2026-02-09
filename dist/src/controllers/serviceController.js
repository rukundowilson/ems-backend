import * as ServiceModel from '../models/Service.js';
export async function createService(req, res) {
    try {
        const { title, slug, description } = req.body;
        if (!title || !slug || !description) {
            return res
                .status(400)
                .json({
                success: false,
                error: 'title, slug, and description are required',
            });
        }
        // Check if slug already exists
        const existing = await ServiceModel.getServiceBySlug(slug);
        if (existing) {
            return res
                .status(409)
                .json({ success: false, error: 'Service slug already exists' });
        }
        const created = await ServiceModel.createService({
            title,
            slug,
            description,
        });
        return res.status(201).json({ success: true, data: created });
    }
    catch (err) {
        console.error('Service create error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
export async function getServiceById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, error: 'Service ID is required' });
        }
        const service = await ServiceModel.getServiceById(id);
        if (!service) {
            return res
                .status(404)
                .json({ success: false, error: 'Service not found' });
        }
        return res.json({ success: true, data: service });
    }
    catch (err) {
        console.error('Service get by id error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
export async function getServiceBySlug(req, res) {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return res
                .status(400)
                .json({ success: false, error: 'Service slug is required' });
        }
        const service = await ServiceModel.getServiceBySlug(slug);
        if (!service) {
            return res
                .status(404)
                .json({ success: false, error: 'Service not found' });
        }
        return res.json({ success: true, data: service });
    }
    catch (err) {
        console.error('Service get by slug error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
export async function getAllServices(req, res) {
    try {
        const services = await ServiceModel.getAllServices();
        return res.json({ success: true, data: services });
    }
    catch (err) {
        console.error('Services get all error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
export async function updateService(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, error: 'Service ID is required' });
        }
        const { title, slug, description } = req.body;
        // If slug is being updated, check for duplicates
        if (slug) {
            const existing = await ServiceModel.getServiceBySlug(slug);
            if (existing && existing._id?.toString() !== id) {
                return res
                    .status(409)
                    .json({ success: false, error: 'Service slug already exists' });
            }
        }
        const updated = await ServiceModel.updateService(id, {
            ...(title && { title }),
            ...(slug && { slug }),
            ...(description && { description }),
        });
        if (!updated) {
            return res
                .status(404)
                .json({ success: false, error: 'Service not found' });
        }
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error('Service update error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
export async function deleteService(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, error: 'Service ID is required' });
        }
        const deleted = await ServiceModel.deleteService(id);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, error: 'Service not found' });
        }
        return res.json({ success: true, message: 'Service deleted successfully' });
    }
    catch (err) {
        console.error('Service delete error', err);
        return res
            .status(500)
            .json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=serviceController.js.map
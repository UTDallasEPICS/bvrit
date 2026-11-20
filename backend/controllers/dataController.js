import petAdoptionModel from "../models/petAdoptionModel.js";

export const getdata = async (req, res) => {
    try {
        const data = await petAdoptionModel.find({
            $or: [
                { adoptionStatus: "Available" },
                { adoptionStatus: { $exists: false } }
            ]
        });
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching pet adoption data:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
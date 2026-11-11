import petAdoptionModel from "../models/petAdoptionModel.js";

export const getdata = async (req, res) => {
    try {
        const data = await petAdoptionModel.find({});

        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
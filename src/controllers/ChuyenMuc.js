import ChuyenMuc from "../models/ChuyenMuc";
import Product from "../models/product";
import { chuyenMucSchema } from "../schemas/ChuyenMuc"

// ADD CATEGORY
export const addChuyenMuc = async (req, res) => {
    try {
        const { error } = chuyenMucSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }
        const category = await ChuyenMuc.create(req.body);
        if (!category) {
            return res.status(404).json({
                message: "Couldn't find a category to add."
            })
        }
        return res.status(200).json({
            message: "Add category successfully!",
            
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};

export const getAllChuyenMuc = async (req, res) => {
    try {
        const chuyenmuc = await ChuyenMuc.find({});
        if (chuyenmuc.length === 0) {
            return res.status(404).json({
                message: "There are no chuyenmuc in the list."
            })
        }
        return res.status(200).json({
            message: "Get chuyenmuc list successfully!",
            chuyenmuc,
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};




export const deleteChuyenMuc = async (req, res) => {
    const { id } = req.params;
    try {
        const chuyenmuc = await ChuyenMuc.findOne({ _id: id });

        if (!chuyenmuc) {
            return res.status(404).json({
                message: "Category doesn't exits!",
            });
        }

        const productsToUpdate = await Product.find({ categoryId: id });

        const uncategorizedCategory = await ChuyenMuc.findOne({
            name: "Uncategorized",
        });

        if (uncategorizedCategory) {
            await Product.updateMany(
                {
                    categoryId: id,
                },
                { categoryId: uncategorizedCategory._id }
            );

            await ChuyenMuc.findByIdAndUpdate(uncategorizedCategory._id, {
                $push: {
                    products: {
                        $each: productsToUpdate.map((product) => product._id),
                    },
                },
            });
        } else {
            // Nếu chưa có danh mục "Uncategorized" thì tạo mới
            const newUncategorizedCategory = await ChuyenMuc.create({
                name: "Uncategorized",
            });

            await Product.updateMany(
                {
                    chuyenMucId: id,
                },
                { chuyenMucId: newUncategorizedCategory._id }
            );
            await ChuyenMuc.findByIdAndUpdate(newUncategorizedCategory._id, {
                $push: {
                    products: {
                        $each: productsToUpdate.map((product) => product._id),
                    },
                },
            });
        }

        await ChuyenMuc.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Delete category successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            erorr: error.message,
        });
    }
};





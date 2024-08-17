const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET;

function getToken(user) {
    if (!user || !user._id) {
        throw new Error('Invalid user for token generation');
    }
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7 days' });
}

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
    Query: {
        getAssetsByType: async (parent, { asset_type, page = 1, pageSize = 10 }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
        
            // Calculate the number of items to skip and limit for pagination
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
        
            // Fetch paginated assets
            const assets = await assetTable.find({ asset_type }).skip(skip).limit(limit).toArray();
        
            // Return assets with formatted ID
            return assets.map(asset => ({
                ...asset,
                id: asset._id.toString(), // Ensure the ID is a string
            }));
        },

        getAssets: async (parent, { page = 1, pageSize = 10 }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            // Calculate the number of items to skip and limit for pagination
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            // Fetch paginated assets
            const assets = await assetTable.find().skip(skip).limit(limit).toArray();
            
            // Return assets with formatted ID
            return assets.map(asset => ({
                ...asset,
                kpi: asset.kpi ? {
                    ...asset.kpi,
                } : null,
                dataViz: asset.dataViz ? {
                    ...asset.dataViz,
                    applicable_kpi_favourite: asset.dataViz.applicable_kpi_favourite
                    ? asset.dataViz.applicable_kpi_favourite.map(kpi => ({
                        ...kpi,
                      }))
                    : null, // If applicable
                } : null,
                layout: asset.layout ? {
                    ...asset.layout,
                    kpis_being_used: asset.layout.kpis_being_used ? 
                    asset.layout.kpis_being_used.map(kpi => ({
                        ...kpi,
                    })) : null,
                } : null,
                storyboard: asset.storyboard ? {
                    ...asset.storyboard,
                    kpis_being_used: asset.storyboard.kpis_being_used ? 
                    asset.storyboard.kpis_being_used.map(kpi => ({
                        ...kpi,
                    })) : null,
                } : null,
                id: asset._id.toString(), // Ensure the ID is a string
            }));
        },

        
        getAssetsByDescriptionSearch: async (parent, { description }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            
            try {
                // Perform a case-insensitive search for assets where the description contains the search term
                const assets = await assetTable.find({
                    description: { $regex: description, $options: 'i' }
                }).toArray();

                return assets.map(asset => {
                    return {
                        ...asset,
                        id: asset._id.toString(), // Ensure the ID is a string
                    };
                }
                );
            } catch (error) {
                console.error('Error fetching assets by description:', error);
                throw new Error('Failed to fetch assets');
            }
        },
        getAsset: async (parent, { id }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            res= await assetTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getKpis: async (parent, args, context) => {
            console.log("getKpis")
            const { db } = context;
            const kpiTable = db.collection('Kpi');
            res= await kpiTable.find().toArray();
            return res.map(kpi => {
                return {
                    ...kpi,
                    id: kpi._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getKpi: async (parent, { id }, context) => {
            const { db } = context;
            const kpiTable = db.collection('Kpi');
            res= await kpiTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getDataVizs: async (parent, args, context) => {
            const { db } = context;
            const dataVizTable = db.collection('DataViz');
            res = await dataVizTable.find().toArray();
            return res.map(dataViz => {
                return {
                    ...dataViz,
                    id: dataViz._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getDataViz: async (parent, { id }, context) => {
            const { db } = context;
            const dataVizTable = db.collection('DataViz');
            res= await dataVizTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getLayouts: async (parent, args, context) => {
            const { db } = context;
            const layoutTable = db.collection('Layout');
            res = await layoutTable.find().toArray();
            return res.map(layout => {
                return {
                    ...layout,
                    id: layout._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getLayout: async (parent, { id }, context) => {
            const { db } = context;
            const layoutTable = db.collection('Layout');
            res = await layoutTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getStoryboards: async (parent, args, context) => {
            const { db } = context;
            const storyboardTable = db.collection('Storyboard');
            res = await storyboardTable.find().toArray();
            return res.map(storyboard => {
                return {
                    ...storyboard,
                    id: storyboard._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getStoryboard: async (parent, { id }, context) => {
            const { db } = context;
            const storyboardTable = db.collection('Storyboard');
            res = await storyboardTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getBusinessQuestions: async (parent, args, context) => {
            const { db } = context;
            const businessQuestionTable = db.collection('BusinessQuestion');
            res = await businessQuestionTable.find().toArray();
            return res.map(businessQuestion => {
                return {
                    ...businessQuestion,
                    id: businessQuestion._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getBusinessQuestion: async (parent, { id }, context) => {
            const { db } = context;
            const businessQuestionTable = db.collection('BusinessQuestion');
            res= await businessQuestionTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        getMetrics: async (parent, args, context) => {
            const { db } = context;
            const metricTable = db.collection('Metric');
            res = await  metricTable.find().toArray();
            return res.map(metric => {
                return {
                    ...metric,
                    id: metric._id.toString(), // Ensure the ID is a string
                };
            });
        },
        getMetric: async (parent, { id }, context) => {
            const { db } = context;
            const metricTable = db.collection('Metric');
            res = await metricTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        }
    },
    Mutation: {
        signUp: async (parent, args, context, info) => {
            const { input } = args;
            const { db } = context;
            const userTable = db.collection('User');
            const hashedPass = bcrypt.hashSync(input.password);
            const user = {
                ...input,
                password: hashedPass,
            }
            const result = await userTable.insertOne(user);
            const dbUser = await userTable.findOne(result.insertedId)
            
            return {
                user: dbUser,
                token: getToken(dbUser)
            }
        },
        signIn: async (parent, args, context, info) => {
            const { input } = args;
            const { db } = context;
            const userTable = db.collection('User');
            const dbUser = await userTable.findOne({ email: input.email }) // email unique field
            if (!dbUser) {
                throw new Error('Invalid credentials!');
            }
            const isPasswordCorrect = bcrypt.compareSync(input.password, dbUser.password);
            if (!isPasswordCorrect) {
                throw new Error('Invalid credentials!');
            }
            return {
                user: dbUser,
                token: getToken(dbUser)
            }
        },

        createAsset: async (parent, { input }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            const newAsset = { ...input };

            // set created_at and updated_at
            newAsset.created_at = new Date();
            newAsset.updated_at = new Date();

            //set created_at and updated_at for kpis
            if (newAsset.kpi) {
                newAsset.kpi.created_at = new Date();
                newAsset.kpi.updated_at = new Date();
            }
            //set created_at and updated_at for dataViz
            if (newAsset.dataViz) {
                newAsset.dataViz.created_at = new Date();
                newAsset.dataViz.updated_at = new Date();
            }
            //set created_at and updated_at for layout
            if (newAsset.layout) {
                newAsset.layout.created_at = new Date();
                newAsset.layout.updated_at = new Date();
            }
            //set created_at and updated_at for storyboard
            if (newAsset.storyboard) {
                newAsset.storyboard.created_at = new Date();
                newAsset.storyboard.updated_at = new Date();
            }

            const result = await assetTable.insertOne(newAsset);
            res = await assetTable.findOne({ _id: result.insertedId });
            // Convert ObjectId to string
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },

        createAssets: async (parent, { input }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            const newAssets = input.map(asset => {
                if (asset.kpi) {
                    asset.kpi.created_at = new Date();
                    asset.kpi.updated_at = new Date();
                }
                if (asset.dataViz) {
                    asset.dataViz.created_at = new Date();
                    asset.dataViz.updated_at = new Date();
                }
                if (asset.layout) {
                    asset.layout.created_at = new Date();
                    asset.layout.updated_at = new Date();
                }
                if (asset.storyboard) {
                    asset.storyboard.created_at = new Date();
                    asset.storyboard.updated_at = new Date();
                }
                return {
                    ...asset,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
            });
            const result = await assetTable.insertMany(newAssets);
            const insertedIdsArray = Object.values(result.insertedIds);
            res = await assetTable.find({ _id: { $in: insertedIdsArray } }).toArray();
            //update assetIds in kpi, dataViz, layout, storyboard
            // Convert ObjectId to string
            return res.map(asset => ({
                ...asset,
                id: asset._id.toString(), // Ensure the ID is a string
            }));
        },

        updateAsset: async (parent, { id, input }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            const updatedAsset = { ...input };
            updatedAsset.updated_at = new Date();
            if (updatedAsset.kpi) {
                updatedAsset.kpi.updated_at = new Date();
            }
            if (updatedAsset.dataViz) {
                updatedAsset.dataViz.updated_at = new Date();
            }
            if (updatedAsset.layout) {
                updatedAsset.layout.updated_at = new Date();
            }
            if (updatedAsset.storyboard) {
                updatedAsset.storyboard.updated_at = new Date();
            }
            await assetTable.updateOne({ _id: ObjectId(id) }, { $set: updatedAsset });
            res = await assetTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteAsset: async (parent, { id }, context) => {
            const { db } = context;
            const assetTable = db.collection('Asset');
            const result = await assetTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },

        createKpi: async (parent, { input }, context) => {
            const { db } = context;
            const kpiTable = db.collection('Kpi');
            const newKpi = { ...input };
            newKpi.created_at = new Date();
            newKpi.updated_at = new Date();
            const result = await kpiTable.insertOne(newKpi);
            res = await kpiTable.findOne({ _id: result.insertedId });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        updateKpi: async (parent, { id, input }, context) => {
            const { db } = context;
            const kpiTable = db.collection('Kpi');
            const updatedKpi = { ...input };
            updatedKpi.updated_at = new Date();
            await kpiTable.updateOne({ _id: ObjectId(id) }, { $set: updatedKpi });
            res = await kpiTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteKpi: async (parent, { id }, context) => {
            const { db } = context;
            const kpiTable = db.collection('Kpi');
            const result = await kpiTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },

        createDataViz: async (parent, { input }, context) => {
            const { db } = context;
            const dataVizTable = db.collection('DataViz');
            const newDataViz = { ...input };
            newDataViz.created_at = new Date();
            newDataViz.updated_at = new Date();
            const result = await dataVizTable.insertOne(newDataViz);
            res = await dataVizTable.findOne({ _id: result.insertedId });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        updateDataViz: async (parent, { id, input }, context) => {
            const { db } = context;
            const dataVizTable = db.collection('DataViz');
            const updatedDataViz = { ...input };
            updatedDataViz.updated_at = new Date();
            await dataVizTable.updateOne({ _id: ObjectId(id) }, { $set: updatedDataViz });
            res = await dataVizTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteDataViz: async (parent, { id }, context) => {
            const { db } = context;
            const dataVizTable = db.collection('DataViz');
            const result = await dataVizTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },

        createLayout: async (parent, { input }, context) => {
            const { db } = context;
            const layoutTable = db.collection('Layout');
            const newLayout = { ...input };
            newLayout.created_at = new Date();
            newLayout.updated_at = new Date();
            const result = await layoutTable.insertOne(newLayout);
            res = await layoutTable.findOne({ _id: result.insertedId });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        updateLayout: async (parent, { id, input }, context) => {
            const { db } = context;
            const layoutTable = db.collection('Layout');
            const updatedLayout = { ...input };
            updatedLayout.updated_at = new Date();
            await layoutTable.updateOne({ _id: ObjectId(id) }, { $set: updatedLayout });
            res = await layoutTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteLayout: async (parent, { id }, context) => {
            const { db } = context;
            const layoutTable = db.collection('Layout');
            const result = await layoutTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },

        createStoryboard: async (parent, { input }, context) => {
            const { db } = context;
            const storyboardTable = db.collection('Storyboard');
            const newStoryboard = { ...input };
            newStoryboard.created_at = new Date();
            newStoryboard.updated_at = new Date();
            const result = await storyboardTable.insertOne(newStoryboard);
            res= storyboardTable.findOne({ _id: result.insertedId });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        updateStoryboard: async (parent, { id, input }, context) => {
            const { db } = context;
            const storyboardTable = db.collection('Storyboard');
            const updatedStoryboard = { ...input };
            updatedStoryboard.updated_at = new Date();
            await storyboardTable.updateOne({ _id: ObjectId(id) }, { $set: updatedStoryboard });
            res= await storyboardTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteStoryboard: async (parent, { id }, context) => {
            const { db } = context;
            const storyboardTable = db.collection('Storyboard');
            const result = await storyboardTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },
        createBusinessQuestion: async (parent, { input }, context) => {
            const { db } = context;
            const businessQuestionTable = db.collection('BusinessQuestion');
            const newBusinessQuestion = { ...input };
            newBusinessQuestion.created_at = new Date();
            newBusinessQuestion.updated_at = new Date();
            const result = await businessQuestionTable.insertOne(newBusinessQuestion);
            dbBusinessQuestion=await businessQuestionTable.findOne({ _id: result.insertedId });
            // Convert ObjectId to string
            return {
                ...dbBusinessQuestion,
                id: dbBusinessQuestion._id.toString(), // Ensure the ID is a string
            };
        },
        updateBusinessQuestion: async (parent, { id, input }, context) => {
            const { db } = context;
            const businessQuestionTable = db.collection('BusinessQuestion');
            const updatedBusinessQuestion = { ...input };
            updatedBusinessQuestion.updated_at = new Date();
            await businessQuestionTable.updateOne({ _id: ObjectId(id) }, { $set: updatedBusinessQuestion });
            res = await businessQuestionTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteBusinessQuestion: async (parent, { id }, context) => {
            const { db } = context;
            const businessQuestionTable = db.collection('BusinessQuestion');
            const result = await businessQuestionTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        },
        createMetric: async (parent, { input }, context) => {
            const { db } = context;
            const metricTable = db.collection('Metric');
            const newMetric = { ...input };
            newMetric.created_at = new Date();
            newMetric.updated_at = new Date();
            const result = await metricTable.insertOne(newMetric);
            res = await metricTable.findOne({ _id: result.insertedId });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        updateMetric: async (parent, { id, input }, context) => {
            const { db } = context;
            const metricTable = db.collection('Metric');
            const updatedMetric = { ...input };
            updatedMetric.updated_at = new Date();

            await metricTable.updateOne({ _id: ObjectId(id) }, { $set: updatedMetric });
            res = await metricTable.findOne({ _id: ObjectId(id) });
            return {
                ...res,
                id: res._id.toString(), // Ensure the ID is a string
            };
        },
        deleteMetric: async (parent, { id }, context) => {
            const { db } = context;
            const metricTable = db.collection('Metric');
            const result = await metricTable.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount > 0;
        }
    } 
};

module.exports = resolvers;
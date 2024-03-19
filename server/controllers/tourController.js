const Tour = require('./../models/toursModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = factory.getAll(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'})

exports.getTourStats = catchAsync(async(req,res,next) => {
    
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    num: {$sum: 1},
                    numRatings: {$sum: '$ratingQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                    
                    
                }
            },
            {
               $sort: {avgPrice: -1}
            }     
            // {
            //     $match: {_id:{$ne: 'EASY'}}
            // }
        ]);
        
        res.status(200).json({
            status: 'Success',
            data: {
                stats
            }
        });

});

exports.getMonthlyPlan = catchAsync(async(req,res,next) => {
   
        const year = req.params.year *1;
        
        const plan = await Tour.aggregate([
           {
            $unwind: '$startDates'
           },
           {
            $match: {
                startDates: {                   
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
               
            }           
           },
           {
            $group: {
                _id: {$month: '$startDates'},
                numToursStarts: {$sum: 1},
                tours: {$push: '$name'},
            }
           },
           {
            $addFields: {
                month: '$_id'
               }
           },
           {
            $project: {
                _id: 0
            }
           },
           {
            $sort: {numToursStarts: -1}
           },
           {
            $limit: 12
           }        
        ]);
        
        res.status(200).json({
            status: 'Success',
            data: {
                plan
            }
        });
});


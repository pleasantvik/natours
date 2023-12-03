const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,summary';

  next();
};

// READING DATA

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      data: {
        tour,
        status: 'success',
      },
    });
  } catch (error) {
    res.send(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};
const createTour = async (req, res) => {
  try {
    if (await Tour.tourNameExistInDB(req.body.name)) {
      console.log(req.body.name);
      throw new Error('Name exist');
    }
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data',
    });
  }
};

const updateTour = async (req, res) => {
  // console.log(req.params);
  // const { id } = req.params;
  // const tour = tours.find((tour) => tour.id === +id);
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (tour)
      res.status(200).json({
        status: 'success',
        data: {
          tour,
          message: 'Tour updated successfully',
        },
      });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: 'success',
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

// const checkID = (req, res, next, val) => {
//   // console.log(`Tour id is ${val}`);

//   if (+val > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next();
// };

module.exports = {
  deleteTour,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  aliasTopTours,
};

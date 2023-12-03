const Tour = require('../models/tourModel');

// READING DATA

const getAllTours = async (req, res) => {
  try {
    //* Get the params from the req.query and exclude the page, sort,limit and fields field
    const queryObj = { ...req.query };
    const excludedField = ['page', 'sort', 'limit', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);

    // console.log(req.query, queryObj);

    // Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //2. NOTE: SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //3. NOTE: FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4. NOTE: PAGINATION
    //page=2&limit=10 means 1-10 page 1 will be skip page 2 11-20.

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    // If we request page 2. it means we are skipping 10 result
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) {
        throw new Error('No data');
      }
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
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
};

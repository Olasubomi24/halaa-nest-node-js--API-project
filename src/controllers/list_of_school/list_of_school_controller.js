import {
  addListOfSchool,
  updateListOfSchool,
  deleteListOfSchool,
  schoolList,
  schoolDetails,
  schoolListById,
} from "../../services/list_of_school/list_of_school_service.js";
import { StatusCodes } from "http-status-codes";

// export const addListOfSchoolController = async (req, res) => {
//   try {
//     const {
//       school_name,
//       halal_id,
//       halal_nest_item_id,
//       location,
//       min_tutorial_fee,
//       max_tutorial_fee,
//       living_facility,
//       video_url,

//     } = req.body;
//   // Retrieve the paths of all uploaded files
//   const image_1 = req.files.map(file => file.path); // Use req.files to get an array of files
//     // Retrieve the paths of all uploaded files
//     const image_2 = req.files.map(file => file.path); // Use req.files to get an array of files
//     // Add validation to ensure all required fields are provided
//     if (!school_name || !halal_id || !halal_nest_item_id || !location) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         status_code: 1,
//         message: "Missing required fields: school_name, halal_id, halal_nest_item_id, or location",
//       });
//     }

//     const schoolDetails = await addListOfSchool({
//       school_name,
//       halal_id,
//       halal_nest_item_id,
//       location,
//       min_tutorial_fee,
//       max_tutorial_fee,
//       living_facility,
//       video_url,
//       image_1,
//       image_2,
//     });

//     if (schoolDetails) {
//       res.status(StatusCodes.OK).json({
//         status_code: 0,
//         message: "School list has been added successfully",
//         schoolDetails, // Corrected key name
//       });
//     } else {
//       throw new Error("Cannot add School list");
//     }
//   } catch (error) {
//     console.error("Error in addSchoolListController:", error);

//     if (error.message.includes("File not found")) {
//       res.status(StatusCodes.OK).json({
//         status_code: 1,
//         message: error.message,
//       });
//     } else {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         status_code: 1,
//         message: "Something went wrong, please try again later",
//       });
//     }
//   }
// };


// updateProductController.js


// export const addListOfSchoolController = async (req, res) => {
//   try {
//     // Extract fields from form-data
//     const {
//       school_name,
//       halal_id,
//       halal_nest_item_id,
//       location,
//       min_tutorial_fee,
//       max_tutorial_fee,
//       living_facility,
//       video_url,
//     } = req.body;

//     // Handle file uploads and check if the files exist
//     const image_1 = req.files && req.files.image_1 ? req.files.image_1.map(file => file.path) : [];
//     const image_2 = req.files && req.files.image_2 ? req.files.image_2.map(file => file.path) : [];

//     // Check for missing required fields
//     const missingFields = [];
//     if (!school_name) missingFields.push("school_name");
//     if (!halal_id) missingFields.push("halal_id");
//     if (!halal_nest_item_id) missingFields.push("halal_nest_item_id");
//     if (!location) missingFields.push("location");

//     if (missingFields.length > 0) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         status_code: 1,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     // Call your addListOfSchool function with the extracted fields
//     const schoolDetails = await addListOfSchool({
//       school_name,
//       halal_id,
//       halal_nest_item_id,
//       location,
//       min_tutorial_fee,
//       max_tutorial_fee,
//       living_facility,
//       video_url,
//       image_1,
//       image_2,
//     });

//     if (schoolDetails) {
//       res.status(StatusCodes.OK).json({
//         status_code: 0,
//         message: "School list has been added successfully",
//         schoolDetails,
//       });
//     } else {
//       throw new Error("Cannot add School list");
//     }
//   } catch (error) {
//     console.error("Error in addSchoolListController:", error);

//     if (error.message.includes("File not found")) {
//       res.status(StatusCodes.OK).json({
//         status_code: 1,
//         message: error.message,
//       });
//     } else {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         status_code: 1,
//         message: "Something went wrong, please try again later",
//       });
//     }
//   }
// };


export const addListOfSchoolController = async (req, res) => {
  try {
      // Log the incoming body and files to debug
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      // Extract form fields from req.body
      const {
          school_name,
          halal_id,
          halal_nest_item_id,
          location,
          min_tutorial_fee,
          max_tutorial_fee,
          living_facility,
          video_url,
      } = req.body;

      // Retrieve file paths
      const image_1 = req.files['image_1'] ? req.files['image_1'].map(file => file.path) : [];
      const image_2 = req.files['image_2'] ? req.files['image_2'].map(file => file.path) : [];

      // Check for missing required fields
      const missingFields = [];
      if (!school_name) missingFields.push('school_name');
      if (!halal_id) missingFields.push('halal_id');
      if (!halal_nest_item_id) missingFields.push('halal_nest_item_id');
      if (!location) missingFields.push('location');

      if (missingFields.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
              status_code: 1,
              message: `Missing required fields: ${missingFields.join(', ')}`,
          });
      }

      // Call your service function
      const schoolDetails = await addListOfSchool({
          school_name,
          halal_id,
          halal_nest_item_id,
          location,
          min_tutorial_fee,
          max_tutorial_fee,
          living_facility,
          video_url,
          image_1,
          image_2,
      });

      if (schoolDetails) {
          return res.status(StatusCodes.OK).json({
              status_code: 0,
              message: 'School list has been added successfully',
              schoolDetails,
          });
      } else {
          throw new Error('Cannot add School list');
      }
  } catch (error) {
      console.error('Error in addListOfSchoolController:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status_code: 1,
          message: 'Something went wrong, please try again later',
      });
  }
};



export const updateSchoolListController = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const updates = req.body;

    // Handle file uploads if present
    const image_1 = req.files && req.files.image_1 ? req.files.image_1.map(file => file.path) : [];
    const image_2 = req.files && req.files.image_2 ? req.files.image_2.map(file => file.path) : [];

    // If files are provided, add them to updates
    if (image_1.length > 0) {
      updates.image_1 = image_1;
    }
    if (image_2.length > 0) {
      updates.image_2 = image_2;
    }

    // Log updates for debugging
    console.log('Updates:', updates);

    const { affectedRows, updatedFields } = await updateListOfSchool(schoolId, updates);

    if (affectedRows > 0) {
      const message = `${updatedFields.join(', ')} updated successfully`;
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message,
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'School not found or no changes were made',
      });
    }
  } catch (error) {
    console.error('Error in updateSchoolListController:', error);
    if (error.message.includes('cannot update')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  }
};




// deleteProductController

export const deleteSchoolController = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const success = await deleteListOfSchool(schoolId);

    if (success) {
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: "School list deleted successfully",
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: "School List not found or already deleted",
      });
    }
  } catch (error) {
    console.error("Error in deleteSchoolListController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: "Something went wrong, please try again later",
    });
  }
};

// productListController

export const schoolListController = async (req, res) => {
  try {
    const schools = await schoolList();

    if (schools.length === 0) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: "No School List available",
      });
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: "School list fetched successfully",
      schools,
    });
  } catch (error) {
    console.error("Error in schoolListController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: "Something went wrong, please try again later",
    });
  }
};
// productListController
export const schoolDetailController = async (req, res) => {
  try {
    const schools = await schoolDetails();

    if (schools.length === 0) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: "No School List available",
      });
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: "School list fetched successfully",
      schools,
    });
  } catch (error) {
    console.error("Error in schoolListController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: "Something went wrong, please try again later",
    });
  }
};

export const schoolListByIdController = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const schoolDetails = await schoolListById(schoolId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: "School details fetched successfully",
      schoolDetails,
    });
  } catch (error) {
    console.error("Error in schoolDetailsByIdController:", error);

    if (error.message === "School not found in the database") {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: "School not found!",
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: "Something went wrong, please try again later",
    });
  }
};

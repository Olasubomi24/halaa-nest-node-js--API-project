import { addvideo, updateVideo, deleteVideo, videoList, videoDetailsById} from "../../services/entertain_service/entertain_service.js";
import { StatusCodes } from "http-status-codes";

export const addVideoController = async (req, res) => {
  try {
    const { video_description, video_title, video_url } = req.body;

    const videoDetails = await addvideo({
      video_description,
      video_title,
      video_url,
    });

    if (videoDetails) {
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Video has been added successfully',
        videos: videoDetails, // Fixed key from `result.videoDetails` to `videoDetails`
      });
    } else {
      throw new Error('Cannot add video');
    }
  } catch (error) {
    console.error('Error in addVideoController:', error);

    if (error.message.includes('File not found')) {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: error.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  }
};




// updateProductController.js

export const updateVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    const updates = req.body;

    const { affectedRows, updatedFields } = await updateVideo(videoId, updates);

    if (affectedRows > 0) {
      const message = `${updatedFields.join(', ')} updated successfully`;
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message,
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Video not found or no changes were made',
      });
    }
  } catch (error) {
    console.error('Error in updateVideoController:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



// deleteProductController

export const deleteVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    const success = await deleteVideo(videoId);

    if (success) {
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Video deleted successfully',
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Video not found or already deleted',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



// productListController

export const videoListController = async (req, res) => {
  try {
    const products = await videoList();

    if (products.length === 0) {
      throw new Error('No videos available');
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Videos fetched successfully',
      products,
    });
  } catch (error) {
    console.error('Error:', error);

    let errorMessage = 'Failed to fetch products';
    if (error.message === 'No videos available') {
      // Return a JSON response with appropriate error message and status code
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'No videos available',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};




export const videoDetailsByIdController = async (req, res) => {
  try {
    const { videoId } = req.params;

    const videoDetails = await videoDetailsById(videoId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Video details fetched successfully',
      videoDetails,
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === "Video not found in the database") {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Video not found!',
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};




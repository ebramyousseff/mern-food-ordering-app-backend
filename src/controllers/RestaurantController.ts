import { Request, Response } from "express";
import Restaurant from "../Models/restaurant";

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCusines as string) || "";
    const sortOption = (req.query.sortOption as string) || "LastedUpdated";
    const page = parseInt(req.query.page as string) || 1;

    const query: any = {};

    query["city"] = new RegExp(city, "i");
    
    const cityCheck = await Restaurant.countDocuments(query);

    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 0,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisine: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();


const total = await Restaurant.countDocuments(query);

    const response = {
        data:restaurants,
        pagination:{
            total,
            page,
            pages: Math.ceil(total / pageSize),
        },
    }

    res.json(response);


  } catch (error) {
    res.status(500).json({ messaga: "Something went wrong" });
  }
};




export default{ searchRestaurants };
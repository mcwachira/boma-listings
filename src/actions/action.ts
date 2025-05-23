"use server";

import {
  createReviewSchema,
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from "@/utils/schemas";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/utils/supabase";
import { calculateTotals } from "@/utils/calculateTotals";
import { formatDate } from "@/utils/format";

const getAuthUser = async () => {
  const user = await currentUser();
  // console.log("User:", user);
  // const { userId } = await auth()
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  if (!user?.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");

  return user;
};
const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create user");
    // console.log(user)
    // console.log(Object.keys(prisma));

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    const users = await prisma.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/");
};

//fetch profile image
export const fetchProfileImage = async () => {
  // const user = await currentUser();

  const user = await currentUser();

  if (!user) return null;
  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!profile) redirect("/profile/create");

  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");

    return { message: "profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const validateFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validateFields.image);
    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });

    revalidatePath("/profile");
    return { message: "profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);
    await prisma.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/");
};
export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await prisma.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return properties;
};

export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await prisma.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  console.log(favorite);
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  propertyId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { propertyId, favoriteId, pathname } = prevState;

  try {
    console.log(favoriteId, pathname, propertyId);
    //if favoriteId exist remove from db else add
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from Faves" : "Added to faves" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavorites = async () => {
  const user = await getAuthUser();

  const favorites = await prisma.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites.map((favorite) => favorite.property);
};

export const fetchPropertyDetails = async (id: string) => {
  return await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  });
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData,
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await prisma.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });

    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: "Review submitted Successfully" };
  } catch (error) {
    // console.error(error)
    return renderError(error);
  }
};

export const fetchPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await prisma.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;

  const user = await getAuthUser();

  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });
    revalidatePath("/reviews");
    return { message: "Review deleted Successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export async function fetchPropertyRating(propertyId: string) {
  const result = await prisma.review.groupBy({
    by: ["propertyId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  return {
    rating: result[0]?._avg.rating?.toFixed() ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

export async function findExistingReviews(userId: string, propertyId: sting) {
  const reviews = await prisma.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  });

  return reviews;
}

export const createBookingAction = async (prevState: {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
}) => {
  const user = await getAuthUser();

  //delete bookinsg where the payment status is false
  await prisma.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });

  let bookingId: null | string = null;
  const { propertyId, checkIn, checkOut } = prevState;
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { price: true },
  });

  if (!property) {
    return { message: "Property not found" };
  }

  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price,
  });

  try {
    const booking = await prisma.booking.create({
      data: {
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId: user.id,
        propertyId,
      },
    });

    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }

  redirect(`/checkout?bookingId=${bookingId}`);
};

export const fetchBookings = async () => {
  const user = await getAuthUser();
  // const user = await currentUser();
  if (!user) return null;
  const bookings = await prisma.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const deleteBookingAction = async (prevState: { bookingId: string }) => {
  const { bookingId } = prevState;

  const user = await getAuthUser();
  try {
    const result = await prisma.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking Deleted Successfully" };
  } catch (error) {
    renderError(error);
  }
};

export const fetchRentals = async () => {
  const user = await getAuthUser();
  const rentals = await prisma.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });
  const rentalsWithBookings = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...rental,
        totalNightSum: totalNightSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    }),
  );

  return rentalsWithBookings;
};

export const deleteRentalAction = async (prevState: { propertyId: string }) => {
  const { propertyId } = prevState;
  const user = await getAuthUser();
  try {
    await prisma.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    });

    revalidatePath("/rentals");
    return {
      message: "Rental Deleted Successfully",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getAuthUser();
  return prisma.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
  });
};

export const updatePropertyAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    });

    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Update Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const updatePropertyImageAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Property Image Updated Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchReservations = async () => {
  const user = await getAuthUser();
  const reservations = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      property: {
        profileId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
        },
      },
    },
  });

  return reservations;
};

export const fetchStats = async () => {
  await getAdminUser();

  const usersCount = await prisma.profile.count();
  const propertiesCount = await prisma.property.count();
  const bookingsCount = await prisma.booking.count({
    where: {
      paymentStatus: true,
    },
  });

  return {
    usersCount,
    propertiesCount,
    bookingsCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const bookings = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const bookingsPerMonth = bookings.reduce(
    (total, current) => {
      const date = formatDate(current.createdAt, true);

      const existingEntry = total.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        total.push({ date, count: 1 });
      }
      return total;
    },
    [] as Array<{ date: string; count: number }>,
  );
  return bookingsPerMonth;
};

export const fetchReservationStats = async () => {
  const user = await getAuthUser();
  const properties = await prisma.property.count({
    where: {
      profileId: user.id,
    },
  });

  const totals = await prisma.booking.aggregate({
    _sum: {
      orderTotal: true,
      totalNights: true,
    },

    where: {
      property: {
        profileId: user.id,
      },
    },
  });

  return {
    properties,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  };
};

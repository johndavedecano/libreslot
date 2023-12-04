// @ts-nocheck
import { isAdminUser } from "$lib/server/admins.js";
import { auth, db } from "$lib/server/firebase.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  try {
    const user = await auth.getUser(params.id);

    if (!user) {
      throw new Error("user not found");
    }

    const userRef = await db.collection("users").doc(params.id).get();
    const userDoc = userRef.data();

    const data = {
      email: user.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      admin: userDoc.admin,
      address: userDoc.address,
      city: userDoc.city,
      province: userDoc.province,
      deleted: userDoc.deleted,
      region: userDoc.region,
      zipcode: userDoc.zipcode,
      avatar: userDoc.avatar,
      mobile: userDoc.mobile,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };

    return json({
      success: true,
      data,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT({ params, request }) {
  try {
    const user = await auth.getUser(params.id);

    if (!user) {
      throw new Error("user not found");
    }

    const body = await request.json();

    if (!body.firstName || !body.lastName) {
      throw new Error("invalid name");
    }

    const data = {
      firstName: body.firstName,
      lastName: body.lastName,
      address: body.address,
      city: body.city,
      province: body.province,
      region: body.region,
      zipcode: body.zipcode,
      avatar: body.avatar,
      mobile: body.mobile,
    };

    await db.collection("users").doc(params.id).update(data);

    await auth.updateUser(params.id, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    return json({
      success: true,
      data,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE({ params }) {
  try {
    if (isAdminUser(params.id)) {
      throw new Error("you cannot delete this account");
    }

    await db.collection("users").doc(params.id).update({
      deleted: true,
    });

    await auth.updateUser(params.id, {
      email: `${Date.now()}@deleted.com`,
    });

    return json({
      success: true,
      message: "successfully deleted",
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

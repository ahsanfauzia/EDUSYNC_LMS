import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import {
  toast,
} from "react-toastify";


export const AppContext =
  createContext();


const AppContextProvider = (
  props
) => {

  // =====================================================
  // BASIC
  // =====================================================

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL;

  const currency = "₹";

  const navigate =
    useNavigate();


  // =====================================================
  // USER STATE
  // =====================================================

  const [
    userData,
    setUserData,
  ] = useState(null);


  // =====================================================
  // COURSE STATE
  // =====================================================

  const [
    allCourses,
    setAllCourses,
  ] = useState([]);


  const [
    enrolledCourses,
    setEnrolledCourses,
  ] = useState([]);


  // =====================================================
  // EDUCATOR STATE
  // =====================================================

  const [
    isEducator,
    setIsEducator,
  ] = useState(false);


  // =====================================================
  // CLERK
  // =====================================================

  const {
    getToken,
    isLoaded: authLoaded,
    isSignedIn,
  } = useAuth();


  const {
    user: clerkUser,
    isLoaded: userLoaded,
  } = useUser();


  // =====================================================
  // AUTH TOKEN
  // =====================================================

  const getAuthToken =
    async () => {

      try {

        if (
          !authLoaded ||
          !isSignedIn
        ) {
          return null;
        }


        const token =
          await getToken();


        return token || null;

      } catch (error) {

        console.error(
          "getAuthToken Error:",
          error
        );

        return null;
      }
    };


  // =====================================================
  // UPDATE EDUCATOR STATUS
  // =====================================================

  useEffect(() => {

    if (
      userLoaded &&
      clerkUser
    ) {

      const role =
        clerkUser.publicMetadata
          ?.role;


      setIsEducator(
        role === "educator" || role === "admin"
      );

    } else {

      setIsEducator(false);

    }

  }, [
    userLoaded,
    clerkUser,
  ]);


  // =====================================================
  // FETCH USER DATA
  // =====================================================

  const fetchUserData =
    async () => {

      try {

        const token =
          await getAuthToken();


        if (!token) {
          return;
        }


        const {
          data,
        } = await axios.get(
          `${backendUrl}/api/user/data`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        if (data.success) {

          setUserData(
            data.user
          );

        }

      } catch (error) {

        console.error(
          "fetchUserData Error:",
          error
        );

      }
    };


  // =====================================================
  // FETCH ENROLLED COURSES
  // =====================================================

  const fetchUserEnrolledCourses =
    async () => {

      try {

        const token =
          await getAuthToken();


        if (!token) {
          return;
        }


        const {
          data,
        } = await axios.get(
          `${backendUrl}/api/user/enrolled-courses`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        if (data.success) {

          setEnrolledCourses(
            data.enrolledCourses ||
              []
          );

        }

      } catch (error) {

        console.error(
          "fetchUserEnrolledCourses Error:",
          error
        );

      }
    };


  // =====================================================
  // FETCH ALL COURSES
  // =====================================================

  const fetchAllCourses =
    async () => {

      try {

        const {
          data,
        } = await axios.get(
          `${backendUrl}/api/course/all`
        );


        if (data.success) {

          setAllCourses(
            data.courses || []
          );

        } else {

          toast.error(
            data.message ||
              "Unable to load courses."
          );

        }

      } catch (error) {

        console.error(
          "fetchAllCourses Error:",
          error
        );


        toast.error(
          error.response?.data
            ?.message ||
            error.message ||
            "Unable to load courses."
        );

      }
    };


  // =====================================================
  // COURSE RATING
  // =====================================================

  const calculateRating = (course) => {

    if (!course) {
      return 0;
    }


    if (typeof course.averageRating === "number") {
      return course.averageRating;
    }

    const ratings =
      Array.isArray(course.courseRating)
        ? course.courseRating
        : Array.isArray(course.ratings)
          ? course.ratings
          : [];


    if (!ratings.length) {
      return 0;
    }


    const totalRating =
      ratings.reduce(
        (sum, item) => {

          const rating =
            typeof item === "number"
              ? item
              : Number(
                  item?.rating || 0
                );


          return sum + rating;

        },
        0
      );


    return totalRating /
      ratings.length;
  };


  // =====================================================
  // ENROLL / PURCHASE COURSE
  // =====================================================

  const enrollCourse = async (courseId) => {
    const token = await getAuthToken();
    if (!token) throw new Error("Please login first.");

    const { data } = await axios.post(
      `${backendUrl}/api/user/purchase`,
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!data.success) throw new Error(data.message || "Unable to enroll.");

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return data;
    }

    await fetchUserData();
    await fetchUserEnrolledCourses();
    return data;
  };


  // =====================================================
  // INITIAL COURSES
  // =====================================================

  useEffect(() => {

    if (backendUrl) {

      fetchAllCourses();

    }

  }, [
    backendUrl,
  ]);


  // =====================================================
  // USER DATA
  // =====================================================

  useEffect(() => {

    if (
      authLoaded &&
      userLoaded &&
      isSignedIn &&
      clerkUser
    ) {

      fetchUserData();

      fetchUserEnrolledCourses();

    } else if (
      authLoaded &&
      !isSignedIn
    ) {

      setUserData(null);

      setEnrolledCourses([]);

      setIsEducator(false);

    }

  }, [
    authLoaded,
    userLoaded,
    isSignedIn,
    clerkUser,
  ]);


  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {

    // basic
    backendUrl,
    currency,
    navigate,

    // user
    userData,
    setUserData,

    // courses
    allCourses,
    setAllCourses,

    enrolledCourses,
    setEnrolledCourses,

    // educator
    isEducator,
    setIsEducator,

    // functions
    fetchAllCourses,
    fetchUserData,
    fetchUserEnrolledCourses,
    enrollCourse,
    calculateRating,

    // auth
    getToken:
      getAuthToken,
  };


  return (
    <AppContext.Provider
      value={value}
    >
      {props.children}
    </AppContext.Provider>
  );
};


export {
  AppContextProvider,
};
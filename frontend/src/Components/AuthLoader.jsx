import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserFromToken } from "@/config/redux/action/authAction";

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserFromToken());
  }, [dispatch]);

  return children;
}

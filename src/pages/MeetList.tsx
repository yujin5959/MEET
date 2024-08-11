import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";

type MeetInfo = {
  id: string;
  title: string;
  date: string | null;
  place: string | null;
};

const MeetList: React.FC = () => {
  const [meetList, setMeetList] = useState<MeetInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const fetchMeetList = async () => {
      try {
        const response = await server.get("/meet/list");
        console.log("Response data:", response.data);
        setMeetList(response.data);
      } catch (error: any) {
        console.error("Error response:", error.response);

        if (error.response) {
          switch (error.response.status) {
            case 401:
              setError("유효하지 않은 토큰입니다.");
              break;
            case 403:
              setError("멤버 권한이 없습니다.");
              break;
            case 404:
              setError("존재하지 않는 모임입니다.");
              break;
            case 500:
              setError("서버 오류가 발생했습니다.");
              break;
            default:
              setError("알 수 없는 오류가 발생했습니다.");
              break;
          }
        } else {
          setError("네트워크 오류 또는 서버에 문제가 있습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetList();
  }, []);

  const navigate = useNavigate();

  const totalPages = Math.ceil(meetList.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedMeetList = meetList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
     <div
      className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-lg rounded-b-3xl"
      style={{ height: "140px", zIndex: 10 }}
      >
    <div className="flex flex-col items-start justify-center h-full px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 leading-tight">
        지금 참여할 모임을 찾아보세요!
      </h1>
      <p className="text-base md:text-lg text-left max-w-lg mx-4 mt-2 md:mt-4 leading-relaxed">
        시간과 장소를 보고 자신에게 맞는 모임을 찾아보세요. <br />
        즐거운 시간을 보낼 기회를 놓치지 마세요!
      </p>
    </div>
    </div>

      {/* 메인 콘텐츠 */}
      <div className="pt-32 flex flex-col items-center m-8 space-y-4">
        {paginatedMeetList.length > 0 ? (
          paginatedMeetList.map((meet) => (
            <Link
              to={`/meet/${meet.id}`}
              key={meet.id}
              className="w-full p-4 bg-white shadow rounded-md hover:bg-gray-100 text-black text-left"
            >
              <h2 className="text-xl font-bold">{meet.title}</h2>
              <p>
                <i className="fa-solid fa-calendar-days"></i>{" "}
                {meet.date ? meet.date : "날짜 미정"}
              </p>
              <p>
                <i className="fa-solid fa-location-dot"></i>{" "}
                {meet.place ? meet.place : "장소 미정"}
              </p>
            </Link>
          ))
        ) : (
          <div>No meetings found.</div>
        )}

        {/* 페이지네이션 UI */}
        <div className="flex space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 w-full bg-blue-500 text-white font-bold py-5">
        <div className="flex justify-around">
          <a
            onClick={() => navigate("/meet")}
            className="text-white hover:text-gray-400 cursor-pointer font-bold"
          >
            모임
          </a>
          <a
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-400 font-bold"
          >
            홈
          </a>
          <a
            href="#contact"
            className="text-white hover:text-gray-400 font-bold"
          >
            사용자
          </a>
        </div>
      </nav>
    </div>
  );
};

export default MeetList;

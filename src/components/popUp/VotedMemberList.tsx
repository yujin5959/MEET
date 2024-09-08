import React from 'react';

interface PopupProps {
  selectedItem: {
    memberList: { name: string }[];
  };
  closePopup: () => void;
}

const VotedMemberList: React.FC<PopupProps> = ({ selectedItem, closePopup }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closePopup}>
      <div className="bg-white rounded-lg shadow-lg p-2 pb-4 w-2/5 max-w-xs z-60" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end items-center h-8">
          <button className="bg-inherit text-gray-500 hover:text-gray-700 focus:outline-none text-sm pr-2" onClick={closePopup}>
            &#x2715; {/* 유니코드 X 표시 */}
          </button>
        </div>
        <ul className="list-none">
          {/* selectedPlace.memberList가 비어 있으면 메시지 출력 */}
          {selectedItem.memberList.length === 0 ? (
            <li className="text-center text-gray-500">투표 없음</li>
          ) : (
            /* memberList가 있을 때 멤버 리스트 출력 */
            selectedItem.memberList.map((member, index) => (
              <li className="mb-1 font-sans flex items-center justify-center" key={index}>
                {/* 연두색 v 아이콘 추가 */}
                <svg
                  className="w-4 h-4 text-green-700 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"  // 테두리를 두껍게 설정
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.485 1.757l.707.707-8.486 8.486L2.5 8.757l.707-.707L5.707 10.55l7.778-7.778z" />
                </svg>
                <p className="w-1/2">{member.name}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default VotedMemberList;
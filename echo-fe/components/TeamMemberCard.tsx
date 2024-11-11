const TeamMemberCard = ({ team }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
            <span className={`p-2 rounded-lg ${team.colorClass}`}>
                <team.icon className="w-5 h-5" />
            </span>
            <div>
                <h4 className="font-medium text-gray-900">{team.name}</h4>
                <p className="text-sm text-gray-500">{team.members.length} 人</p>
            </div>
        </div>
        <div className="grid gap-3">
            {team.members.map((member, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {member.name.slice(0, 1)}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-gray-500">{member.role}</div>
                        </div>
                    </div>
                    {member.isLead && (
                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                            负责人
                        </span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default TeamMemberCard;
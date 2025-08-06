
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const UserManager = ({ users }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Usuários Cadastrados ({users.length})
      </h3>
      <div className="grid gap-2 max-h-40 overflow-y-auto no-scrollbar">
        {users.map((user) => (
          <Card key={user.id} className="glass-effect border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-gray-300">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManager;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersianLayout } from "@/components/layout/PersianLayout";
import { PersianButton } from "@/components/ui/persian-button";
import { PersianCard, PersianCardContent, PersianCardHeader, PersianCardTitle } from "@/components/ui/persian-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    display_name: '',
    role: 'user'
  });
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "دسترسی محدود",
          description: "شما به این بخش دسترسی ندارید",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate("/dashboard");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "خطا در بارگیری",
        description: "نتوانستیم کاربران را بارگیری کنیم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          display_name: newUser.display_name
        }
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: newUser.email,
          display_name: newUser.display_name,
          role: newUser.role
        });

      if (profileError) throw profileError;

      toast({
        title: "کاربر اضافه شد",
        description: "کاربر جدید با موفقیت ایجاد شد",
      });

      setIsAddUserOpen(false);
      setNewUser({ email: '', password: '', display_name: '', role: 'user' });
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "خطا در افزودن کاربر",
        description: error.message || "نتوانستیم کاربر را اضافه کنیم",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "نقش کاربر تغییر کرد",
        description: "نقش کاربر با موفقیت به‌روزرسانی شد",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "خطا در تغییر نقش",
        description: error.message || "نتوانستیم نقش کاربر را تغییر دهیم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) {
      return;
    }

    try {
      // Delete from profiles first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      toast({
        title: "کاربر حذف شد",
        description: "کاربر با موفقیت حذف شد",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "خطا در حذف کاربر",
        description: error.message || "نتوانستیم کاربر را حذف کنیم",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      case 'author': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدیر';
      case 'editor': return 'ویراستار';
      case 'author': return 'نویسنده';
      default: return 'کاربر';
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PersianLayout variant="dashboard">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <PersianButton variant="ghost" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  بازگشت
                </PersianButton>
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">مدیریت کاربران</h1>
                  <p className="text-muted-foreground">مدیریت دسترسی و کاربران سیستم</p>
                </div>
              </div>

              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <PersianButton variant="default">
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن کاربر
                  </PersianButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>افزودن کاربر جدید</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">ایمیل</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">رمز عبور</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="رمز عبور قوی انتخاب کنید"
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_name">نام نمایشی</Label>
                      <Input
                        id="display_name"
                        value={newUser.display_name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, display_name: e.target.value }))}
                        placeholder="نام و نام خانوادگی"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">نقش</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">کاربر</SelectItem>
                          <SelectItem value="author">نویسنده</SelectItem>
                          <SelectItem value="editor">ویراستار</SelectItem>
                          <SelectItem value="admin">مدیر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <PersianButton 
                        onClick={handleAddUser}
                        disabled={!newUser.email || !newUser.password || !newUser.display_name}
                      >
                        <UserPlus className="ml-2 h-4 w-4" />
                        ایجاد کاربر
                      </PersianButton>
                      <PersianButton variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        انصراف
                      </PersianButton>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="جستجو در کاربران..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Users Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PersianCard key={i} className="animate-pulse">
                  <PersianCardContent className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">کاربری یافت نشد</h3>
              <p className="text-muted-foreground">هیچ کاربری با این شرایط یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <PersianCard 
                  key={user.id} 
                  variant="elegant"
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PersianCardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <PersianCardTitle className="text-base">
                            {user.display_name || 'بدون نام'}
                          </PersianCardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </PersianCardHeader>
                  
                  <PersianCardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        عضویت: {new Date(user.created_at).toLocaleDateString('fa-IR')}
                      </div>

                      {/* Password Field */}
                      <div className="flex items-center gap-2">
                        <Input
                          type={showPasswords[user.id] ? "text" : "password"}
                          value="••••••••"
                          readOnly
                          className="text-sm"
                        />
                        <PersianButton
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {showPasswords[user.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </PersianButton>
                      </div>

                      {/* Role Selection */}
                      <div>
                        <Label className="text-xs">تغییر نقش:</Label>
                        <Select 
                          value={user.role} 
                          onValueChange={(newRole) => handleUpdateUserRole(user.user_id, newRole)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">کاربر</SelectItem>
                            <SelectItem value="author">نویسنده</SelectItem>
                            <SelectItem value="editor">ویراستار</SelectItem>
                            <SelectItem value="admin">مدیر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <PersianButton
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.user_id)}
                          disabled={user.user_id === user?.id} // Can't delete yourself
                        >
                          <Trash2 className="h-4 w-4" />
                        </PersianButton>
                      </div>
                    </div>
                  </PersianCardContent>
                </PersianCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </PersianLayout>
  );
};

export default UserManagement;
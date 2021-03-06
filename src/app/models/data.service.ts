import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Announcement } from './announcements/Announcement';
import { Observable } from 'rxjs';
import { GetAnnouncements } from './announcements/getAnnouncements';
import {ViewAssignments} from './assignments/View-Assignments';
import {Submissions} from './assignments/Submissions';
import {LoggedInfo} from './users/LoggedInfo';
import {AuthService} from './users/auth.service';
import {Assignment} from './assignments/Assignment';
import {ViewSubmissions} from './assignments/View-Submissions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = 'http://localhost/backend/';
  announcements: GetAnnouncements[];

  constructor(private http: HttpClient, private authService: AuthService) { }

  getHeaders() {
    const emptyheaders = new HttpHeaders();
    const contentType = emptyheaders.append('content-Type', 'application/x-www-form-urlencoded');
    const authorization = contentType.append('Authorization', this.authService.isLoggedIn ? this.authService.isLoggedIn.token : '');
    return authorization;
  }

  addAnnouncement(teacherId: number, body: string): Observable<Announcement[]> {
    const params = `teacherid=${teacherId}&body=${body}`;
    return this.http.post<Announcement[]>(this.baseUrl + 'teachers/addAnnouncement', params, {headers: this.getHeaders()});
  }

  getAnnouncements(): Observable<GetAnnouncements[]> {
    return this.http.get<GetAnnouncements[]>(this.baseUrl + 'initials/getAnnouncements');
  }

  getAssignment(data: LoggedInfo): Observable<ViewAssignments[]> {
    const params = `${data.accountType}_id=${data.id}`;
    return this.http.post<ViewAssignments[]>(this.baseUrl + `${data.accountType}s/listAssignments/`, params, {headers: this.getHeaders()});
  }

  submitAssignment(data: Submissions): Observable<Submissions[]> {
    const params = `studentid=${data.studentId}&assignmentid=${data.assignmentId}&text=${data.text}`;
    return this.http.post<Submissions[]>(this.baseUrl + 'Students/addSubmission', params, {headers: this.getHeaders()});
  }

  announcementRead(studentId: number, announcementId: number) {
    const params = `studentid=${studentId}&announcementid=${announcementId}`;
    return this.http.post<any>(this.baseUrl + 'Students/addAnnouncementRead', params, {headers: this.getHeaders()});
  }
  
  addAssignment(data: Assignment): Observable<boolean> {
    const params = `teacherId=${data.teacherId}&subject=${data.subject}&releaseDate=${data.releaseDate}&dueDate=${data.dueDate}&body=${data.body}`;
    return this.http.post<any>(this.baseUrl + 'teachers/addAssignment', params, {headers: this.getHeaders()});
  }

  updateAnnouncement( id: number, teacherId: number, body: string): Observable<boolean> {
    const params = `id=${id}&teacherid=${teacherId}&body=${body}`;
    return this.http.post<any>(this.baseUrl + 'teachers/updateAnnouncement', params, {headers: this.getHeaders()});
  }

  deleteAnnouncement(id: number): Observable<boolean> {
    const params = `id=${id}`;
    return this.http.post<any>(this.baseUrl + 'teachers/deleteAnnouncement', params, {headers: this.getHeaders()});
  }

  getSubmissions(asignementId: number): Observable<ViewSubmissions[]> {
    const params = `assignment_id=${asignementId}`;
    return this.http.post<ViewSubmissions[]>(this.baseUrl + 'Teachers/listSubmissions', params, {headers: this.getHeaders()});
  }

  updateSubmission( studentid: number, assignmentid: number, grade: number): Observable<boolean> {
    const params = `studentid=${studentid}&assignmentid=${assignmentid}&grade=${grade}`;
    return this.http.post<any>(this.baseUrl + 'teachers/updateSubmission', params, {headers: this.getHeaders()});
  }

  register(accountType: 'teacher' | 'student', name: string, password: string): Observable<any> {
    const params = `accountType=${accountType}&name=${name}&password=${password}`;
    return this.http.post<any>(this.baseUrl + 'Initials/register', params, {headers: this.getHeaders()});
  }
}

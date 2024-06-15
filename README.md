### API REFERENCE
http://54.180.29.36/api-reference

### branch 전략
1. 요구사항에 대한 issue 생성
2. issue에 해당하는 branch 생성 (settings, docs 제외)
3. main branch에 병합
4. 병합 완료 후 branch 삭제

### branch naming rule

{{label}}/#{{issue_NO}}

ex)feat/#21 : issue 21번에 대한 branch

### PR RULE

* main branch에는 동작 가능한 코드만 merge 합니다.
* code review 완료된 pr만 merge 합니다.
